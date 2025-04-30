<template>
    <v-footer>
        <v-container>
            <v-row no-gutters class="text-center">
                <v-col cols="12" md="6">
                    <v-row class="my-1 text-medium-emphasis text-body-2">
                        <v-col cols="6" md="2">
                            <v-img src="/img/cf-logo-v-rgb.png" style="margin-top:-8px;margin-bottom:2px"/>
                            Hosted by <a href="https://cloudflare.com" target="_blank">Cloudflare</a> Workers and Pages
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-divider class="my-2"/>
            <v-row no-gutters justify="center">
                <v-col>
                    <v-btn variant="text" href="https://legal.inventivetalent.org/imprint">Imprint</v-btn>
                    <v-btn variant="text" href="https://legal.inventivetalent.org/privacy">Privacy</v-btn>
                    <v-btn variant="text" href="https://legal.inventivetalent.org/terms">Terms</v-btn>
                </v-col>
                <v-col class="text-center">
                    <div class="my-1">Made by <a
                        href="https://inventivetalent.org"
                        target="_blank">inventivetalent</a></div>
                </v-col>
                <v-col class="text-right">
                    Not affiliated with Minecraft / Mojang AB / Microsoft.
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
</template>