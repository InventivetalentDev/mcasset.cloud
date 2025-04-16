import {useGitHubApi} from "~/composables/useGitHubApi";

export const useGitHubUser = defineQuery(() => {

    const {state, ...rest} = useQuery({
        key: ['github','user'],
        query: async () => {
            return useGitHubApi('https://api.github.com/user?d=_');
        }
    });

    return {
        ...rest,
        githubUser: state
    }
});
