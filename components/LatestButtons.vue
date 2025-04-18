<template>
  <div>
    <v-btn @click="useLatestRelease">Latest Release ({{ latestRelease }})</v-btn>
    <v-btn @click="useLatestSnapshot">Latest Snapshot ({{ latestSnapshot }})</v-btn>
  </div>
</template>