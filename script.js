var isCrawler = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);

var assetApp = angular.module("assetApp", ["ngRoute", "ngCookies", "ngMeta"]);

assetApp.config(function ($locationProvider, ngMetaProvider) {
    $locationProvider.html5Mode(true);

    ngMetaProvider.useTitleSuffix(true);
    ngMetaProvider.setDefaultTitleSuffix(" | Minecraft Assets");
    ngMetaProvider.setDefaultTitle("MC Assets - Browser for Minecraft Asset Files");
    ngMetaProvider.setDefaultTag("image", "https://mcasset.cloud/img/mc-assets-2-512.png");

});

assetApp.run(['ngMeta', function (ngMeta) {
    ngMeta.init();
}]);

assetApp.controller("assetController", ["$scope", "$location", "$http", "$timeout", "$routeParams", "$cookies", "$window", "ngMeta", "$sce", function ($scope, $location, $http, $timeout, $routeParams, $cookies, $window, ngMeta,$sce) {
    ngMeta.setTitle("MC Assets - Browser for Minecraft Asset Files", "");

    window._$scope = $scope;

    $scope.asset = {
        version: undefined,
        path: "/",
        pathElements: []
    };
    $scope.versionInfo = {
        id: "",
        type: "",
        url: "",
        time: "",
        releaseTime: "",
        downloadTimestamp: 0
    };
    $scope.assetsLoading = false;
    $scope.assetIndex = [];
    $scope.dirShas = {};
    $scope.currentDir = "/";
    $scope.parentDir = "/";
    $scope.cachedResponses = {};
    $scope.shouldLoadMore = false;
    $scope.githubRequestsRemaining = 60;
    $scope.githubRequestsReset = 0;
    $scope.githubAccessToken = undefined;
    $scope.githubUser = undefined;
    $scope.versionChanged = function () {
        $scope.asset.path = "/";
        $scope.refreshPath();

        $http({
            url: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/" + $scope.getRef() + "/version.json"
        }).then(function (response) {
            $scope.versionInfo = response.data;
        })
    };
    $scope.refreshPath = function (skipUrlUpdate) {
        var split = $scope.asset.path.split("/");
        $scope.asset.pathElements = [];
        for (var i = 0; i < split.length; i++) {
            if (split[i].length > 0) {// skip empty elements
                $scope.asset.pathElements.push(split[i]);
            }
        }

        let pathWithoutLast = $scope.asset.pathElements.slice(0, $scope.asset.pathElements.length);
        if (pathWithoutLast.length > 0) {
            pathWithoutLast.pop();
        }
        $scope.parentDir = pathWithoutLast.join("/");


        var trimmedPath = $scope.asset.path;
        if (trimmedPath.endsWith("/")) {
            trimmedPath = trimmedPath.substring(0, trimmedPath.length - 1);
        }

        let dirChanged = false;
        if (trimmedPath) {
            if (trimmedPath !== $scope.currentDir) {
                dirChanged = true;
            }
            $scope.currentDir = trimmedPath;
        }
        console.log("Current Dir: " + $scope.asset.path);
        console.log("Parent Dir:  " + $scope.parentDir);

        if (dirChanged) {
            $scope.shouldLoadMore = false;
        }

        if ($scope.shouldLoadMore) {
            $scope.loadMore();
        } else {
            $scope.load();
        }

        if (!skipUrlUpdate) {
        }
        $location.path("/" + $scope.asset.version.replace(/__/g, "_").replace(/ /g, "_") + "/" + trimmedPath);
    };
    $scope.getRef = function () {
        return $scope.asset.version.replace(/__/g, "_").replace(/ /g, "_");
    }
    $scope.addAssetExtra = function (asset) {
        asset.proxy_url = $sce.trustAsResourceUrl("https://assets.mcasset.cloud/" + $scope.getRef() + "/" + asset.path);
    };
    $scope.load = function () {
        $scope.assetIndex = [];
        $scope.githubRequest("https://api.github.com/repos/InventivetalentDev/minecraft-assets/contents" + ($scope.currentDir || "") + "?ref=" + $scope.getRef(),
            function (response) {
                for (let a of response.data) {
                    $scope.addAssetExtra(a);
                }
                $scope.assetIndex = response.data;
                $scope.updateShas();
            },
            function (error) {
            });
    };
    $scope.loadMore = function () {
        $scope.shouldLoadMore = true;
        $scope.getCurrentDirSha(function (currentDirSha) {
            console.log("Current Dir Sha: " + currentDirSha);
            if (currentDirSha) {
                $scope.assetIndex = [];
                $scope.githubRequest("https://api.github.com/repos/InventivetalentDev/minecraft-assets/git/trees/" + currentDirSha,
                    function (response) {
                        let tempIndex = response.data.tree;
                        for (let asset of tempIndex) {
                            asset._type = asset.type;
                            if (asset.type === "tree") {
                                asset.type = "dir";
                            }
                            if (asset.type === "blob") {
                                asset.type = "file";
                            }

                            if (!asset.name) { // avoid using path as name again on cached responses
                                asset.name = asset.path;

                                asset._path = asset.path;
                                asset.path = $scope.currentDir + "/" + asset.path;
                            }

                            asset.url = "https://api.github.com/repos/InventivetalentDev/minecraft-assets/contents/" + asset.path + "?ref=" + $scope.getRef();
                            asset.html_url = "https://github.com/InventivetalentDev/minecraft-assets/tree/" + $scope.getRef() + "/" + asset.path;
                            asset.git_url = asset.url;
                            asset.download_url = "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/" + $scope.getRef() + "/" + asset.path;
                            $scope.addAssetExtra(asset);

                            $scope.assetIndex.push(asset);
                        }
                    },
                    function (error) {
                    });
            }
        })
    };
    $scope.updateShas = function (source = $scope.assetIndex) {
        for (let asset of source) {
            if (asset.type === "dir") {
                $scope.dirShas[asset.path] = asset.sha;
            }
        }
    };
    $scope.getCurrentDirSha = function (cb) {
        if ($scope.dirShas.hasOwnProperty($scope.currentDir)) {
            cb($scope.dirShas[$scope.currentDir]);
            return;
        }
        $scope.githubRequest("https://api.github.com/repos/InventivetalentDev/minecraft-assets/contents" + $scope.parentDir + "?ref=" + $scope.asset.version.replace(/__/g, "_").replace(/ /g, "_"),
            function (response) {
                $scope.updateShas(response.data);
                cb($scope.dirShas[$scope.currentDir]);
            },
            function (error) {
            });
    };
    $scope.githubRequest = function (url, success, error) {
        if ($scope.cachedResponses.hasOwnProperty(url)) {
            success($scope.cachedResponses[url]);
            return;
        }

        var headers = {};
        if ($scope.githubAccessToken) {
            headers["Authorization"] = "token " + atob($scope.githubAccessToken);
        }
        $http({
            url: url,
            headers: headers
        }).then(function (response) {
            console.log(response);
            $scope.githubRequestsRemaining = parseInt(response.headers("X-RateLimit-Remaining"));
            $scope.githubRequestsReset = parseInt(response.headers("X-RateLimit-Reset"));
            $scope.cachedResponses[url] = response;
            success(response);
        }, function (response) {
            console.log(response);
            error(response);

            if (response.status === 401) {
                if (response.data.message === "Bad credentials") {// OAuth token is no longer valid
                    $cookies.remove("gh_access_token");
                    $scope.githubAccessToken = undefined;
                    if (!isCrawler)
                        $("#githubAuthModal").modal("show");
                    return;
                }
            }
            if (response.status === 404) {
                console.log(response.data.message)
                if (response.data.message.startsWith("No commit found for the ref")) {
                    alert("Assets for this version are not yet generated.\n" +
                        "Please bug @Inventivtalent on twitter to get it updated ;)");
                    return;
                }
            }
            alert("GitHub Error: " + response.data.message);
        });
    };
    $scope.goToPath = function (path, $event) {
        if ($event) {
            $event.preventDefault();
        }
        $scope.asset.path = path;
        $scope.refreshPath();
    };
    $scope.getJoinedPath = function (untilPos) {
        var path = "";
        for (var i = 0; i < Math.min(untilPos, $scope.asset.pathElements.length); i++) {
            path += "/" + $scope.asset.pathElements[i];
        }
        return path;
    };

    $scope.openFile = function (file, $event) {
        if ($event) {
            $event.preventDefault();
        }

        $scope.addAssetExtra(file);

        console.log(file);
        console.log(file.download_url);
        console.log(file.proxy_url)
//            window.open(downloadUrl, "_blank");

        ngMeta.setTitle(file.name);

        $scope.previewFile = file;
        $("#previewModal").modal("show");
        $http({
            url: file.download_url
        }).then(function (response) {
            $scope.previewFile._contentType = response.headers("Content-Type");
            $scope.previewFile._isImage = function () {
                return $scope.previewFile._contentType.startsWith('image/')
            };
            $scope.previewFile._isText = function () {
                return $scope.previewFile._contentType.startsWith('text/')
            };
            $scope.previewFile._isAudio = function () {
                return $scope.previewFile._contentType.startsWith('audio/')
            };

            $scope.previewFile._content = response.data;

            // Try to format JSON
            try {
                if ($scope.previewFile._content.toString() === "[object Object]") {
                    console.info("File is JSON")
                    $scope.previewFile._content = JSON.stringify($scope.previewFile._content, null, 2);
                }
            } catch (e) {
            }
        });

        $location.path("/" + $scope.asset.version.replace(/__/g, "_").replace(/ /g, "_") + "/" + file.path);
    };

    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    $scope.isJsonFile = function (name) {
        return name.endsWith(".json");
    };
    $scope.isImageFile = function (name) {
        return name.endsWith(".png");
    };
    $scope.isAudioFile = function (name) {
        return name.endsWith(".ogg");
    };

    $scope.previewFile = undefined;

    $scope.showOldVersions = false;
    $scope.versions = {
        latest: {
            release: "",
            snapshot: ""
        },
        versions: []
    };

    $scope.showNav = false;
    $window.onscroll = function () {
        $timeout(function () {
            if (window.scrollY > 580) {
                $scope.showNav = true;
            } else {
                $scope.showNav = false;
            }
        })
    };


    $timeout(function () {
        // Load versions
        $http({
            url: "https://cloudflare-worker-cors.inventive.workers.dev/?url=https://piston-meta.mojang.com/mc/game/version_manifest_v2.json"
        }).then(function (response) {
            $scope.versions = response.data;
            console.info("Latest Version: " + $scope.versions.latest.release + " (release) / " + $scope.versions.latest.snapshot + " (snapshot)")
        });

        // GitHub authentication
        $scope.githubAccessToken = $cookies.get("gh_access_token");
        if (!$scope.githubAccessToken) {
            $scope.githubRequestsRemaining = 60;
            if (!isCrawler)
                $("#githubAuthModal").modal("show");
        } else {
            $scope.githubRequestsRemaining = 5000;
            $scope.githubRequest("https://api.github.com/user?d=_",
                function (response) {
                    $scope.githubUser = response.data;
                    console.log($scope.githubUser);
                }, function (error) {

                })
        }
    }, 250);

    function handleHistoryChange() {
        var path = $location.path();
        console.log(path);
        var pathSplit = path.split("\/").filter(function (value) {
            return value.length > 0;
        });
        console.log(pathSplit);
        if (pathSplit.length > 0) {
            if (pathSplit[0].startsWith("index.html")) {
                return;
            }
            $scope.asset.version = pathSplit[0].replace(/__/g, "_").replace(/ /g, "_");
            console.log("URL version:" + pathSplit[0]);
            if (pathSplit.length > 1) {
                pathSplit.shift();
                $scope.asset.path = pathSplit.join("/");
                console.log("URL path:" + $scope.asset.path);

                var trimmedPath = $scope.asset.path;
                if (trimmedPath.endsWith("/")) {
                    trimmedPath = trimmedPath.substring(0, trimmedPath.length - 1);
                }
                $scope.githubRequest("https://api.github.com/repos/InventivetalentDev/minecraft-assets/contents" + trimmedPath + "?ref=" + $scope.asset.version.replace(/__/g, "_").replace(/ /g, "_"),
                    function (response) {
                        console.log(response);
                        if (!Array.isArray(response.data)) {
                            // Probably a file
                            $scope.openFile(response.data);

                            pathSplit.pop();
                            $scope.asset.path = pathSplit.join("/");
                        }

                        $scope.refreshPath(true);
                    },
                    function (error) {
                    });
            } else {
                $scope.asset.path = "/";
                $scope.refreshPath(true);
            }
        }
    }

    $timeout(handleHistoryChange, 1000);

    $scope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
        console.log("$locationChangeSuccess");
        console.log(oldUrl, "->", newUrl)
        if (newUrl !== oldUrl) {
            handleHistoryChange();
        }
    });
}]);
