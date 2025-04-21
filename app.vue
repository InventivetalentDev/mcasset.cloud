<template>
  <NuxtLayout>
    <v-app>
      <Jumbotron/>
      <v-main>
        <NuxtPage/>
      </v-main>
      <Footer/>
    </v-app>
  </NuxtLayout>
</template>
<script setup lang="ts">

import { useSeoMeta } from "#imports";

const description = "MC Assets is a browser for Minecraft asset files. Explore all Textures, Sounds, Models, Fonts, Shaders, and more from any Minecraft version";

useSeoMeta({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${ titleChunk } - MC Assets` : 'MC Assets - Browser for Minecraft Asset Files';
    },
    ogSiteName: 'MC Assets',
    description: description,
    ogDescription: description,
    twitterDescription: description,
    author: 'inventivetalent',
});
useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/img/mc-assets-2-64.png'
    }
  ],
  script: [
    {
      src: '//cdn.cookie-script.com/s/78e7a161e0aab723429cad3e34a13db5.js',
      tagPosition: 'head'
    },
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-HBJZL7F0XS',
      async: true,
      'data-cookie-consent': 'tracking',
      tagPosition: 'head'
    },
    {
      innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-HBJZL7F0XS');
            `,
      'data-cookie-consent': 'tracking',
      tagPosition: 'head'
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://mcasset.cloud/",
        "name": "MC Assets",
        "alternateName": "mcasset.cloud",
        "description": description
      }),
    }
  ]
}, {
  mode: 'client'
})
</script>