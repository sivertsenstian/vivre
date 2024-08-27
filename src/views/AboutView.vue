<script setup lang="ts">
import MarkdownViewer from "@/components/MarkdownViewer.vue";

const model = defineModel<string>({
  default: `
  # Hello and welcome to my page!
  Hello, I'm Longjacket. I like to code and make things.
  I also like to play Warcraft 3. I am good at one of these things.

  I made this page to help motivate myself to play more warcraft 3 - and you can use it too if you want!

  ## Things you can do on the page
  - You can use the [Live](/#/) feature to track weekly progress and get live information while laddering on w3champions.
    Just enter your w3champions battle tag at the top right on the page.
  - You can browse the different [Creep Routes](/#/creeproutes) available on the page.
    - I have added all the Human creep routes, based on Fortitudes recent ladder preference.
    - Razer from the wc3 community recently added the Undead creep routes, based on Happy!
  - You can browse, add and rate [Build Orders](/#/buildorders) that are defined by the community.
  - I sometimes also create an [Event](/#/events/road-to-3000) page, most recently Mr.SaulApeMan was [Tracking](/#/events/happy-tracker) Happys run to 3000 MR, which was shown live here in the app and on twitch stream!

  ## How to help?
   - If you would like to contribute with Orc or Night Elf creep routes, give me a message on the [w3champions](https://discord.gg/uJmQxG2) or [wc3 gym](https://discord.com/invite/7HUyQAKQ8p) discord - @Longjacket
   - Otherwise just using the page, or giving feedback is always appreciated, a coffee to help me code and update the page is also greatly appreciated - see link at the bottom!

  ## Thanks <3
   - Thanks to all the people behind https://w3champions.com/ for creating and maintaining an awesome wc3 ladder and community
   - Thanks to everyone at https://warcraft-gym.com/ for helping me and others get better at this relaxing game
   - Thanks to https://www.back2warcraft.com/ for helping promote, use and support my efforts.
     - Check out the stream at https://www.twitch.tv/back2warcraft
   - Thanks to mr. president SaulApeMan for coming up with the idea of the Happy event, and starting to use and promote the page when I was the only user.
     - Check out his stream at https://www.twitch.tv/back2warcraft!
   - Thanks to Razer for providing creeproutes for the Undeads!.
     - Check out his stream at https://www.twitch.tv/razerwc3
  `,
});
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-sheet class="pa-8" elevation="10" style="min-height: 90vh">
        <v-row>
          <v-col cols="12">
            <markdown-viewer v-model="model" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <a href="https://www.buymeacoffee.com/longjacket" target="_blank"
              ><img
                src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=longjacket&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
            /></a>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
