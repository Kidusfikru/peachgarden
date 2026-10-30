<template>
  <Transition name="panel-fade">
    <div v-if="open" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
      <div class="game-panel w-full max-w-xs text-center relative">
        <button class="absolute top-2 right-2 text-muted hover:text-text" @click="$emit('close')">
          <X :size="14" />
        </button>
        <Divider title class="my-4" label="Settings" />
        <!-- Category navigation -->
        <div class="grid grid-cols-3 justify-center gap-1 mb-3">
          <button
            v-for="tab in SETTINGS_TABS"
            :key="tab.key"
            class="text-xs py-1 px-3 border rounded-xs transition-colors"
            :class="activeTab === tab.key ? 'border-accent bg-accent/20 text-accent' : 'border-accent/20 text-muted hover:text-text'"
            @click="activeTab = tab.key"
          >
            <component :is="tab.icon" :size="12" class="inline-block align-[-2px] mr-1" />
            {{ tab.label }}
          </button>
        </div>

        <div class="flex flex-col space-y-3">
          <!-- ===== General ===== -->
          <template v-if="activeTab === 'general'">
            <div class="max-h-[40vh] overflow-y-auto">
              <!-- Time control -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1 mb-2">
                <p class="text-xs text-muted mb-2">Time control</p>
                <div class="flex items-center justify-center space-x-2">
                  <Button :icon="isPaused ? Play : Pause" :icon-size="12" class="py-1 px-3" @click="togglePause">
                    {{ isPaused ? 'continue' : 'pause' }}
                  </Button>
                  <Button class="py-1 px-3" @click="cycleSpeed">Speed {{ gameSpeed }}×</Button>
                </div>
              </div>

              <!-- Audio control -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1 mb-2">
                <p class="text-xs text-muted mb-2">Audio</p>
                <div class="flex items-center justify-center space-x-2">
                  <Button :icon="sfxEnabled ? Volume2 : VolumeX" :icon-size="12" class="py-1 px-3" @click="toggleSfx">Sound effect</Button>
                  <Button :icon="bgmEnabled ? Headphones : HeadphoneOff" :icon-size="12" class="py-1 px-3" @click="toggleBgm">Music</Button>
                </div>
              </div>

              <!-- Farming: Automatic fertilization during seasonal changes (only Taoyuan Farm has this feature) -->
              <div v-if="gameStore.farmMapType === 'standard'" class="border border-accent/20 rounded-xs p-3 mr-1 mb-2">
                <p class="text-xs text-muted mb-2">Automatic fertilization during seasonal changes</p>
                <p class="text-[10px] text-muted/50 mb-2">Features of Taoyuan Farm: Spread fertilizer on idle farmland during the change of seasons. The fertilizer that is automatically spread after it is turned on will occupy the plot, but you can still cover it with better fertilizer.
                </p>
                <div class="flex items-center justify-center space-x-2">
                  <Button
                    class="py-1 px-3"
                    :class="{
                      '!bg-accent !text-bg': settingsStore.autoFertilizeOnSeasonChange
                    }"@click="settingsStore.autoFertilizeOnSeasonChange = true"
                  >
                    turn on
                  </Button>
                  <Button
                    class="py-1 px-3"
                    :class="{
                      '!bg-accent !text-bg': !settingsStore.autoFertilizeOnSeasonChange
                    }"
                    @click="settingsStore.autoFertilizeOnSeasonChange = false"
                  >
                    close
                  </Button>
                </div>
              </div>

              <!-- One-click fishing: skip the reel-in mini-game -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1 mb-2">
                <p class="text-xs text-muted mb-2">One-click fishing</p>
                <p class="text-[10px] text-muted/50 mb-2">
                  After turning it on, the result will be obtained directly by throwing the rod, without having to play the reeling-in game. The success rate still depends on the fishing rod, fishing level, bait float and fish difficulty, but perfect ratings are less common than manual.
                </p>
                <div class="flex items-center justify-center space-x-2">
                  <Button
                    class="py-1 px-3"
                    :class="{ '!bg-accent !text-bg': settingsStore.autoFishing }"
                    @click="settingsStore.autoFishing = true"
                  >
                    turn on
                  </Button>
                  <Button
                    class="py-1 px-3"
                    :class="{ '!bg-accent !text-bg': !settingsStore.autoFishing }"
                    @click="settingsStore.autoFishing = false"
                  >
                    close
                  </Button>
                </div>
              </div>

              <!-- Tips for newbies -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1 mb-2">
                <p class="text-xs text-muted mb-2">Tips for newbies</p>
                <p class="text-[10px] text-muted/50 mb-2">Mr. Willow’s morning suggestions and panel guidance text</p>
                <div class="flex items-center justify-center space-x-2">
                  <Button class="py-1 px-3" :class="{ '!bg-accent !text-bg': tutorialStore.enabled }" @click="tutorialStore.enabled = true">
                    open
                  </Button>
                  <Button
                    class="py-1 px-3":class="{ '!bg-accent !text-bg': !tutorialStore.enabled }"
                    @click="tutorialStore.enabled = false"
                  >
                    close
                  </Button>
                </div>
              </div>

              <!-- WebDAV cloud synchronization -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs text-muted">WebDAV cloud synchronization</p>
                  <div class="flex space-x-1">
                    <Button
                      class="py-0.5 px-2 text-[10px]"
                      :class="{ '!bg-accent !text-bg': webdavConfig.enabled }"
                      @click="setWebdavEnabled(true)"
                    >
                      open
                    </Button>
                    <Buttonclass="py-0.5 px-2 text-[10px]"
                      :class="{ '!bg-accent !text-bg': !webdavConfig.enabled }"
                      @click="setWebdavEnabled(false)"
                    >
                      close
                    </Button>
                  </div>
                </div>

                <!-- Note for newbies: Without clear explanation, novices will not know what to fill in these four input boxes -->
                <div class="border border-accent/10 rounded-xs p-2 mb-2">
                  <button class="flex items-center justify-between w-full" @click="showWebdavHelp = !showWebdavHelp">
                    <span class="text-[10px] text-accent">
                      <HelpCircle :size="10" class="inline" />
                      What is this? How to use it?
                    </span>
                    <span class="text-[10px] text-muted">{{ showWebdavHelp ? 'Collapse' : 'Expand' }}</span>
                  </button>
                  <div v-if="showWebdavHelp" class="mt-2 space-y-1.5">
                    <p class="text-[10px] text-muted leading-relaxed">
                      By default, the archive only exists in the browser of this device. If you change the phone or clear the cache, it will be gone. WebDAV
                      It is equivalent to your own network disk. After opening it, you can upload the archives and download them back on other devices to continue playing.
                    </p>
                    <p class="text-[10px] text-accent/80">You can use it in three steps:</p>
                    <p class="text-[10px] text-muted leading-relaxed">
                      ① Find a network disk that supports WebDAV, register and find "WebDAV" in its settings, and get
                      <span class="text-text">Server address</span>
                      ,
                      <span class="text-text">Account</span>
                      and
                      <span class="text-text">Password</span>. Common ones include: Nut Cloud (domestic, free quota is enough), InfiniCLOUD, TeraCLOUD, or you can use Nextcloud / Synology NAS.
                    </p>
                    <p class="text-[10px] text-muted leading-relaxed">
                      ② Fill in these three items into the input box below.
                      <span class="text-text">Storage path</span>
                      You can leave it blank or fill in a folder name (e.g.
                      <span class="text-text">taoyuan</span>
                      ) to place the archives separately.
                    </p>
                    <p class="text-[10px] text-muted leading-relaxed">
                      ③ Click "Test Connection". If it connects, it means the configuration is complete. Then use the "Upload" button below to upload the current progress. When changing devices, click "Download" under the same configuration to get it back.
                    </p>
                    <p class="text-[10px] text-muted/60 leading-relaxed">
                      Reminder: Passwords are saved in your local browser. It is recommended to generate a separate "application password" in the network disk and fill it in here. Do not use your main account password.
                    </p>
                    <p class="text-[10px] text-muted/60 leading-relaxed">
                      Note: The WebDAV address of services such as Nut Cloud is usually in the form of https://dav.jianguoyun.com/dav/, which must be filled in completely (including https:// and the trailing /).
                    </p>
                  </div>
                </div>
                <template v-if="webdavConfig.enabled">
                  <div class="flex flex-col space-y-2">
                    <div>
                      <label class="text-[10px] text-muted mb-0.5 block">Server address</label>
                      <input
                        v-model="webdavConfig.serverUrl"
                        placeholder="Please enter the WebDAV cloud synchronization server address" class="w-full px-2 py-1.5 bg-bg border border-accent/30 rounded-xs text-xs text-text focus:border-accent outline-none placeholder:text-muted/40 transition-colors"
                        @change="saveWebdavConfig"
                      />
                    </div>
                    <div>
                      <label class="text-[10px] text-muted mb-0.5 block">Storage path</label>
                      <input
                        v-model="webdavConfig.path"
                        placeholder="can be empty if there is no path requirement"
                        class="w-full px-2 py-1.5 bg-bg border border-accent/30 rounded-xs text-xs text-text focus:border-accent outline-none placeholder:text-muted/40 transition-colors"
                        @change="saveWebdavConfig"
                      /><p class="text-[10px] text-muted/50 mt-0.5">Fill in the existing folder name in the network disk, leave it blank to save to the root directory</p>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="text-[10px] text-muted mb-0.5 block">Username</label>
                        <input
                          v-model="webdavConfig.username"
                          placeholder="Please enter username"
                          class="w-full px-2 py-1.5 bg-bg border border-accent/30 rounded-xs text-xs text-text focus:border-accent outline-none placeholder:text-muted/40 transition-colors"
                          @change="saveWebdavConfig"
                        />
                      </div>
                      <div>
                        <label class="text-[10px] text-muted mb-0.5 block">Password</label>
                        <input
                          v-model="webdavConfig.password"
                          type="password"
                          placeholder="Please enter password"
                          class="w-full px-2 py-1.5 bg-bg border border-accent/30 rounded-xs text-xs text-text focus:border-accent outline-none placeholder:text-muted/40 transition-colors"
                          @change="saveWebdavConfig"
                        />
                      </div>
                    </div>
                    <Button
                      class="py-1 px-3 text-xs w-full justify-center"
                      :disabled="webdavTestStatus === 'testing' || !webdavConfig.serverUrl"
                      @click="handleTestWebdav"
                    >
                      {{ webdavTestStatus === 'testing' ? 'Testing...' : 'Testing connection' }}
                    </Button>
                    <p v-if="webdavTestStatus === 'success'" class="text-success text-xs text-center mt-1 break-words">Connection successful</p>
                    <p v-if="webdavTestStatus === 'failed'" class="text-danger text-xs text-center mt-1 break-words">
                      {{ webdavTestError || 'Connection failed' }}
                    </p>
                    <div v-if="webdavTraceLogs.length" class="border border-accent/20 rounded-xs p-2 bg-bg/40"><div class="flex items-center justify-between mb-1">
                        <p class="text-[10px] text-muted">Request process log</p>
                        <button class="text-[10px] text-muted hover:text-text" @click="clearWebdavTrace">Clear</button>
                      </div>
                      <div class="max-h-28 overflow-y-auto text-left">
                        <p v-for="(line, idx) in webdavTraceLogs" :key="idx" class="text-[10px] text-muted/80 leading-4 break-all">
                          {{ line }}
                        </p>
                      </div><button class="webdav-log-copy text-[10px] text-muted hover:text-text">Copy log</button>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>

          <!-- ===== Appearance ===== -->
          <template v-if="activeTab === 'display'">
            <!-- Font size -->
            <div class="border border-accent/20 rounded-xs p-3">
              <p class="text-xs text-muted mb-2">Font size</p>
              <div class="flex items-center justify-center space-x-3">
                <Button
                  class="py-1 px-3"
                  :icon="Minus"
                  :icon-size="12"
                  :disabled="settingsStore.fontSize <= 12"
                  @click="settingsStore.changeFontSize(-1)"
                />
                <span class="text-sm w-8 text-center">{{ settingsStore.fontSize }}</span>
                <Button
                  class="py-1 px-3"
                  :icon="Plus"
                  :icon-size="12"
                  :disabled="settingsStore.fontSize >= 24"
                  @click="settingsStore.changeFontSize(1)"
                />
              </div>
            </div>

            <!-- Description of mine operations -->
            <div class="border border-accent/20 rounded-xs p-3">
              <p class="text-xs text-muted mb-2">Mining action description</p>
              <div class="flex items-center justify-center space-x-2">
                <Button
                  v-for="n in MINE_LOG_LINE_OPTIONS"
                  :key="n"
                  class="py-1 px-3"
                  :class="settingsStore.mineLogLines === n ? '!bg-accent !text-bg' : ''"
                  @click="settingsStore.mineLogLines = n"
                >
                  {{ n === 0 ? 'Do not display' : `${n}line` }}
                </Button>
              </div>
              <p class="text-[10px] text-muted/50 mt-1.5 text-center">Reducing the number of lines makes the stamina bar and grid easier to see</p>
            </div>

            <!-- Color theme -->
            <div class="border border-accent/20 rounded-xs p-3">
              <p class="text-xs text-muted mb-2">Color color theme</p>
              <div class="flex items-center justify-center space-x-2">
                <button
                  v-for="t in THEMES"
                  :key="t.key"
                  class="w-8 h-8 border rounded-xs flex items-center justify-center text-[10px] transition-colors":class="settingsStore.theme === t.key ? 'border-accent' : 'border-accent/20'"
                  :style="{ backgroundColor: t.bg, color: t.text }"
                  :title="t.name"
                  @click="settingsStore.changeTheme(t.key)"
                >
                  {{ t.name.charAt(0) }}
                </button>
              </div>
            </div>
          </template>

          <!-- ===== Notification ===== --><template v-if="activeTab === 'notification'">
            <div class="max-h-[40vh] overflow-y-auto flex flex-col space-y-3">
              <!-- Notification location -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1">
                <p class="text-xs text-muted mb-2">Pop-up position</p>
                <div class="grid grid-cols-3 gap-1 w-24 mx-auto">
                  <button
                    v-for="pos in QMSG_POSITIONS"
                    :key="pos.value"
                    class="w-8 h-6 border rounded-xs transition-colors flex items-center justify-center"
                    :class="
                      settingsStore.qmsgPosition === pos.value ? 'border-accent bg-accent/20 text-accent' : 'border-accent/20 text-muted'
                    "
                    :title="pos.label"
                    @click="settingsStore.changeQmsgPosition(pos.value)"
                  >
                    <component :is="pos.icon" :size="10" />
                  </button>
                </div>
              </div>

              <!-- Duration -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1">
                <p class="text-xs text-muted mb-2">Duration</p>
                <div class="flex items-center justify-center space-x-2">
                  <Button
                    class="py-0 px-1.5"
                    :icon="Minus"
                    :icon-size="10"
                    :disabled="settingsStore.qmsgTimeout <= 500"
                    @click="changeTimeout(-500)"
                  />
                  <span class="text-xs w-12 text-center">{{ (settingsStore.qmsgTimeout / 1000).toFixed(1) }}s</span>
                  <Button
                    class="py-0 px-1.5"
                    :icon="Plus"
                    :icon-size="10"
                    :disabled="settingsStore.qmsgTimeout >= 10000"
                    @click="changeTimeout(500)"
                  />
                </div>
              </div>

              <!-- Maximum quantity -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1">
                <p class="text-xs text-muted mb-2">Maximum quantity</p>
                <div class="flex items-center justify-center space-x-2">
                  <Button
                    class="py-0 px-1.5"
                    :icon="Minus"
                    :icon-size="10"
                    :disabled="settingsStore.qmsgMaxNums <= 1"
                    @click="changeMaxNums(-1)"
                  /><span class="text-xs w-6 text-center">{{ settingsStore.qmsgMaxNums }}</span>
                  <Button
                    class="py-0 px-1.5"
                    :icon="Plus"
                    :icon-size="10"
                    :disabled="settingsStore.qmsgMaxNums >= 20"
                    @click="changeMaxNums(1)"
                  />
                </div>
              </div>

              <!-- Width limit --><div class="border border-accent/20 rounded-xs p-3 mr-1">
                <p class="text-xs text-muted mb-2">Limit width</p>
                <div class="flex items-center justify-center space-x-1 mb-2">
                  <Button
                    class="py-0 px-2"
                    :class="settingsStore.qmsgIsLimitWidth ? '!bg-accent/20 !text-accent !border-accent' : ''"
                    @click="setBool('qmsgIsLimitWidth', true)"
                  >
                    open
                  </Button>
                  <Button
                    class="py-0 px-2"
                    :class="!settingsStore.qmsgIsLimitWidth ? '!bg-accent/20 !text-accent !border-accent' : ''"
                    @click="setBool('qmsgIsLimitWidth', false)"
                  >
                    close
                  </Button>
                </div>
                <template v-if="settingsStore.qmsgIsLimitWidth">
                  <p class="text-xs text-muted mb-2">Width (px)</p>
                  <div class="flex items-center justify-center space-x-2 mb-2">
                    <Button
                      class="py-0 px-1.5"
                      :icon="Minus"
                      :icon-size="10"
                      :disabled="settingsStore.qmsgLimitWidthNum <= 100"
                      @click="changeLimitWidth(-50)"
                    />
                    <span class="text-xs w-10 text-center">{{ settingsStore.qmsgLimitWidthNum }}</span>
                    <Button
                      class="py-0 px-1.5"
                      :icon="Plus"
                      :icon-size="10"
                      :disabled="settingsStore.qmsgLimitWidthNum >= 800"
                      @click="changeLimitWidth(50)"
                    />
                  </div>
                  <p class="text-xs text-muted mb-2">Exceeding processing</p>
                  <div class="flex items-center justify-center space-x-1">
                    <Button
                      v-for="opt in WRAP_OPTIONS"
                      :key="opt.value"
                      class="!text-[10px] py-0 px-1.5"
                      :class="settingsStore.qmsgLimitWidthWrap === opt.value ? '!bg-accent/20 !text-accent !border-accent' : ''"
                      @click="changeWrap(opt.value)"
                    >
                      {{ opt.label }}
                    </Button>
                  </div>
                </template>
              </div>

              <!-- Switch options -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1 flex flex-col space-y-2"><div v-for="opt in TOGGLE_OPTIONS" :key="opt.key" class="flex flex-col items-center space-y-1">
                  <span class="text-xs text-muted">{{ opt.label }}</span>
                  <div class="flex items-center space-x-1">
                    <Button
                      class="py-0 px-2"
                      :class="settingsStore[opt.key] ? '!bg-accent/20 !text-accent !border-accent' : ''"@click="setBool(opt.key, true)"
                    >
                      open
                    </Button>
                    <Button
                      class="py-0 px-2"
                      :class="!settingsStore[opt.key] ? '!bg-accent/20 !text-accent !border-accent' : ''"
                      @click="setBool(opt.key, false)"
                    >
                      close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Archive management (global bottom) -->
        <Button :icon="FolderOpen" :icon-size="12" class="py-1 px-3 w-full justify-center mt-3" @click="showSaveManager = true">
          Archive management
        </Button>
      </div>
    </div>
  </Transition>

  <!-- Archive management pop-up window -->
  <Transition name="panel-fade">
    <SaveManager v-if="showSaveManager" @close="showSaveManager = false" />
  </Transition>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, type Component } from 'vue'
  import {
    X,
    Pause,
    Play,
    Volume2,
    VolumeX,
    Headphones,
    HeadphoneOff,
    FolderOpen,
    Minus,
    Plus,
    ArrowUpLeft,
    ArrowUp,
    ArrowUpRight,
    ArrowLeft,
    Circle,
    ArrowRight,
    ArrowDownLeft,
    ArrowDown,
    ArrowDownRight,
    Settings,
    Palette,
    Bell,
    HelpCircle
  } from 'lucide-vue-next'
  import Button from '@/components/game/Button.vue'
  import Divider from '@/components/game/Divider.vue'
  import { useAudio } from '@/composables/useAudio'
  import { useGameClock } from '@/composables/useGameClock'
  import { useGameLog } from '@/composables/useGameLog'
  import { useSettingsStore, MINE_LOG_LINE_OPTIONS, type QmsgPosition, type QmsgLimitWidthWrap } from '@/stores/useSettingsStore'
  import { useTutorialStore } from '@/stores/useTutorialStore'
  import { useGameStore } from '@/stores/useGameStore'
  import { useWebdav } from '@/composables/useWebdav'
  import { THEMES } from '@/data/themes'
  import SaveManager from '@/components/game/SaveManager.vue'
  import ClipboardJS from 'clipboard'

  type SettingsTab = 'general' | 'display' | 'notification'

  type BoolSettingKey = 'qmsgIsLimitWidth' | 'qmsgAnimation' | 'qmsgAutoClose' | 'qmsgShowClose' | 'qmsgShowIcon' | 'qmsgShowReverse'

  const SETTINGS_TABS: { key: SettingsTab; label: string; icon: Component }[] = [
    { key: 'general', label: 'general', icon: Settings },
    { key: 'display', label: 'Appearance', icon: Palette },
    { key: 'notification', label: 'notification', icon: Bell }
  ]const QMSG_POSITIONS: {
    value: QmsgPosition
    label: string
    icon: Component
  }[] = [
    { value: 'topleft', label: 'topleft', icon: ArrowUpLeft },
    { value: 'top', label: '上', icon: ArrowUp },
    { value: 'topright', label: 'top right', icon: ArrowUpRight },
    { value: 'left', label: 'left', icon: ArrowLeft },{ value: 'center', label: '中', icon: Circle },
    { value: 'right', label: 'right', icon: ArrowRight },
    { value: 'bottomleft', label: 'bottomleft', icon: ArrowDownLeft },
    { value: 'bottom', label: '下', icon: ArrowDown },
    { value: 'bottomright', label: 'bottom right', icon: ArrowDownRight }
  ]

  const WRAP_OPTIONS: { value: QmsgLimitWidthWrap; label: string }[] = [
    { value: 'no-wrap', label: 'Do not process' },
    { value: 'wrap', label: 'newline' },
    { value: 'ellipsis', label: 'ellipsis' }
  ]

  const TOGGLE_OPTIONS: { key: BoolSettingKey; label: string }[] = [
    { key: 'qmsgAnimation', label: 'pop-up animation' },
    { key: 'qmsgAutoClose', label: 'auto close' },
    { key: 'qmsgShowClose', label: 'Show close icon' },
    { key: 'qmsgShowIcon', label: 'Show left icon' },
    { key: 'qmsgShowReverse', label: 'Pop-up direction reverse' }
  ]

  defineProps<{ open: boolean }>()
  defineEmits<{ close: [] }>()

  const activeTab = ref<SettingsTab>('general')
  /** WebDAV Newbie Instructions Whether to expand */
  const showWebdavHelp = ref(false)
  const { sfxEnabled, bgmEnabled, toggleSfx, toggleBgm } = useAudio()
  const { isPaused, gameSpeed, togglePause, cycleSpeed } = useGameClock()
  const { showFloat } = useGameLog()
  const settingsStore = useSettingsStore()
  const gameStore = useGameStore()
  const tutorialStore = useTutorialStore()
  const {
    webdavConfig,
    webdavTestStatus,
    webdavTestError,
    webdavTraceLogs,
    saveConfig: saveWebdavConfig,
    clearTrace: clearWebdavTrace,
    testConnection
  } = useWebdav()

  const showSaveManager = ref(false)
  let clipboard: ClipboardJS | null = null

  onMounted(() => {
    clipboard = new ClipboardJS('.webdav-log-copy', {
      text: () => webdavTraceLogs.value.join('\n')
    })
    clipboard.on('success', e => {
      e.clearSelection()
      showFloat('Log copied', 'success')
    })
    clipboard.on('error', () => {
      document.body.classList.remove('select-none')
      showFloat('Copy failed, please copy manually', 'danger')
    })
  })

  onBeforeUnmount(() => {
    clipboard?.destroy()
    clipboard = null
  })

  const handleTestWebdav = async () => {
    await testConnection()
  }

  const setWebdavEnabled = (val: boolean) => {
    webdavConfig.value.enabled = val
    saveWebdavConfig()
  }

  const changeTimeout = (delta: number) => {
    settingsStore.qmsgTimeout = Math.min(10000, Math.max(500, settingsStore.qmsgTimeout + delta))
    settingsStore.syncQmsgConfig()
  }

  const changeMaxNums = (delta: number) => {
    settingsStore.qmsgMaxNums = Math.min(20, Math.max(1, settingsStore.qmsgMaxNums + delta))
    settingsStore.syncQmsgConfig()
  }

  const changeLimitWidth = (delta: number) => {settingsStore.qmsgLimitWidthNum = Math.min(800, Math.max(100, settingsStore.qmsgLimitWidthNum + delta))
    settingsStore.syncQmsgConfig()
  }

  const changeWrap = (value: QmsgLimitWidthWrap) => {
    settingsStore.qmsgLimitWidthWrap = valuesettingsStore.syncQmsgConfig()
  }

  const setBool = (key: BoolSettingKey, value: boolean) => {
    settingsStore[key] = value
    settingsStore.syncQmsgConfig()
  }
</script>

<style scoped>
  .yes-select {
    -webkit-user-select: unset;
    user-select: unset;
    -webkit-touch-callout: unset;
  }
</style>