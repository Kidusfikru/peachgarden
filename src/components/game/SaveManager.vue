<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="game-panel w-full max-w-md text-center relative max-h-[80vh] flex flex-col">
      <button class="absolute top-2 right-2 text-muted hover:text-text" @click="$emit('close')">
        <X :size="14" />
      </button>
      <Divider title class="my-4" label="Archive Management" />
      <div class="flex-1 flex flex-col space-y-2 mb-3" @click="menuOpen = null">
        <div v-for="info in slots" :key="info.slot">
          <div v-if="info.exists" class="flex space-x-1 w-full">
            <button v-if="allowLoad" class="btn flex-1 !justify-between text-xs" @click="$emit('load', info.slot)">
              <span class="inline-flex items-center space-x-1">
                <FolderOpen :size="12" />
                <span>Archive {{ info.slot + 1 }}</span>
              </span>
              <span class="text-muted text-xs">
                {{ info.playerName ?? 'Unnamed' }} · Year {{ info.year }}
                {{ SEASON_NAMES[info.season as keyof typeof SEASON_NAMES] }}
                Day {{ info.day }}
              </span>
            </button>
            <div v-else class="btn flex-1 !justify-between text-xs cursor-default">
              <span class="inline-flex items-center space-x-1">
                <FolderOpen :size="12" />
                <span>Archive {{ info.slot + 1 }}</span>
              </span>
              <span class="text-muted text-xs">
                {{ info.playerName ?? 'Unnamed' }} · Year {{ info.year }}
                {{ SEASON_NAMES[info.season as keyof typeof SEASON_NAMES] }}
                Day {{ info.day }}
              </span>
            </div>
            <div class="relative">
              <Button
                class="px-2 h-full"
                :icon="Settings"
                :icon-size="12"
                @click.stop="menuOpen = menuOpen === info.slot ? null : info.slot"
              />
              <div
                v-if="menuOpen === info.slot"
                class="absolute right-0 top-full mt-1 z-10 flex flex-col border border-accent/30 rounded-xs overflow-hidden w-30"
              >
                <Button
                  v-if="webdavReady"
                  :icon="CloudUpload"
                  :icon-size="12"
                  class="text-center !rounded-none justify-center text-sm"
                  :disabled="uploading"
                  @click="handleUpload(info.slot)"
                >
                  {{ uploading ? 'Uploading...' : 'Uploading to the cloud' }}
                </Button>
                <Button
                  v-if="webdavReady"
                  :icon="CloudDownload"
                  :icon-size="12"
                  class="text-center !rounded-none justify-center text-sm"
                  :disabled="downloading"
                  @click="handleDownload(info.slot)"
                >
                  {{ downloading ? 'Downloading...' : 'Cloud download' }}
                </Button>
                <Buttonv-if="!Capacitor.isNativePlatform()"
                  :icon="Download"
                  :icon-size="12"
                  class="text-center !rounded-none justify-center text-sm"
                  @click="handleExport(info.slot)"
                >
                  Export archive
                </Button>
                <Button
                  :icon="Trash2"
                  :icon-size="12"
                  class="btn-danger !rounded-none text-center justify-center text-sm"
                  @click="handleDelete(info.slot)"
                >
                  Delete archive
                </Button>
              </div>
            </div>
          </div>
          <div v-else class="flex space-x-1 w-full">
            <div class="text-xs text-muted border border-accent/10 rounded-xs px-3 py-2 flex-1">Archive {{ info.slot + 1 }} — empty</div>
            <Button
              v-if="webdavReady"
              :icon="CloudDownload"
              :icon-size="12"
              class="px-2"
              :disabled="downloading"
              @click="handleDownload(info.slot)"
            >
              <span class="text-xs">{{ downloading ? 'Downloading...' : 'Cloud' }}</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Import archive -->
      <template v-if="!Capacitor.isNativePlatform()">
        <Button :icon="Upload" class="text-center justify-center text-sm w-full" @click="triggerImport">Import archive</Button>
        <input ref="fileInputRef" type="file" accept=".tyx" class="hidden" @change="handleImportFile" />
      </template>

      <!-- Delete archive confirmation pop-up window -->
      <Transition name="panel-fade">
        <div
          v-if="deleteTargetSlot !== null"
          class="fixed inset-0 z-60 flex items-center justify-center bg-bg/80"
          @click.self="deleteTargetSlot = null"
        >
          <div class="game-panel w-full max-w-xs mx-4 text-center">
            <p class="text-danger text-sm mb-3">Are you sure you want to delete the archive {{ deleteTargetSlot + 1 }}? </p>
            <p class="text-xs text-muted mb-4">This operation is not reversible. </p>
            <div class="flex space-x-3 justify-center">
              <Button @click="deleteTargetSlot = null">Cancel</Button>
              <Button class="btn-danger" @click="confirmDelete">Confirm deletion</Button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { X, FolderOpen, Settings, Download, Trash2, Upload, CloudUpload, CloudDownload } from 'lucide-vue-next'
  import Button from '@/components/game/Button.vue'
  import Divider from '@/components/game/Divider.vue'
  import { SEASON_NAMES } from '@/stores/useGameStore'
  import { useSaveStore } from '@/stores/useSaveStore'
  import { showFloat } from '@/composables/useGameLog'
  import { useWebdav } from '@/composables/useWebdav'
  import {Capacitor} from '@capacitor/core'

  defineProps<{ allowLoad?: boolean }>()
  const emit = defineEmits<{ close: []; load: [slot: number]; change: [] }>()const saveStore = useSaveStore()
  const { webdavReady, uploadSave, downloadSave } = useWebdav()

  const slots = ref(saveStore.getSlots())
  const menuOpen = ref<number | null>(null)
  const uploading = ref(false)
  const downloading = ref(false)

  const refreshSlots = () => {
    slots.value = saveStore.getSlots()
  }

  const handleExport = (slot: number) => {
    if (!saveStore.exportSave(slot)) {
      showFloat('Export failed.', 'danger')
    }
  }

  const deleteTargetSlot = ref<number | null>(null)

  const handleDelete = (slot: number) => {
    deleteTargetSlot.value = slot
  }

  const confirmDelete = () => {
    if (deleteTargetSlot.value !== null) {
      saveStore.deleteSlot(deleteTargetSlot.value)
      refreshSlots()
      emit('change')
      deleteTargetSlot.value = null
      menuOpen.value = null
    }
  }

  const fileInputRef = ref<HTMLInputElement | null>(null)

  const triggerImport = () => {
    fileInputRef.value?.click()
  }

  const handleImportFile = (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string
      const emptySlot = slots.value.find(s => !s.exists)
      if (!emptySlot) {
        showFloat('The archive slot is full, please delete an old archive first.')
      } else if (saveStore.importSave(emptySlot.slot, content)) {
        refreshSlots()
        emit('change')
        showFloat(`Imported into archive ${emptySlot.slot + 1}.`, 'success')
      } else {
        showFloat('The archive file is invalid or damaged.', 'danger')
      }
      input.value = ''
    }
    reader.readAsText(file)
  }

  const handleUpload = async (slot: number) => {
    uploading.value = true
    const result = await uploadSave(slot)
    uploading.value = false
    showFloat(result.message, result.success? 'success' : 'danger')
    menuOpen.value = null
  }

  const handleDownload = async (slot: number) => {
    downloading.value = true
    const result = await downloadSave(slot)
    downloading.value = false
    if (result.success) {
      refreshSlots()
      emit('change')
    }
    showFloat(result.message, result.success? 'success' : 'danger')
    menuOpen.value = null
  }
</script>