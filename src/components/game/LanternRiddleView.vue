<template>
  <div class="game-panel max-w-sm w-full">
    <h3 class="text-accent text-sm mb-3 flex items-center space-x-1">
      <Lightbulb :size="14" />
      <span>Guessing lantern riddles on Chinese Valentine’s Day</span>
    </h3>

    <!-- Preparation -->
    <div v-if="phase === 'ready'">
      <p class="text-xs text-muted mb-3">The square is filled with lanterns, and there is a riddle under each lantern. There are 5 questions in total, each question is timed, and there will be prizes for correct answers! </p>
      <Button class="w-full" @click="startGame">Start guessing! </Button>
    </div>

    <!-- Display lanterns -->
    <div v-else-if="phase === 'showing'" class="text-center py-4">
      <div class="lantern-drop mb-3">
        <div class="inline-block border-2 border-accent/50 px-6 py-3">
          <Lamp :size="20" class="text-accent mx-auto mb-1" />
          <p class="text-accent text-xs">Question {{ currentIndex + 1 }}</p>
        </div>
      </div>
      <!-- Progress point -->
      <div class="flex justify-center space-x-2 mt-2">
        <div v-for="i in 5" :key="i" class="w-2 h-2" :class="dotClass(i - 1)" />
      </div>
    </div>

    <!-- Answering questions -->
    <div v-else-if="phase === 'answering'">
      <!-- Progress point + countdown -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center space-x-1.5">
          <div v-for="i in 5" :key="i" class="w-2 h-2" :class="dotClass(i - 1)" />
        </div>
        <p class="text-xs" :class="countdown <= 3 ? 'text-danger time-pulse' : 'text-accent'">
          <Timer :size="12" class="inline -mt-0.5" />
          {{ countdown }}s
        </p>
      </div>

      <!-- Countdown bar -->
      <div class="h-1 bg-bg border border-accent/20 mb-3">
        <div
          class="h-full transition-all duration-1000 ease-linear"
          :class="countdown <= 3 ? 'bg-danger/60' : 'bg-accent/60'"
          :style="{ width: `${(countdown / currentTimeLimit) * 100}%` }"
        />
      </div>

      <!-- Mystery -->
      <div class="border border-accent/30 p-3 mb-3 text-center">
        <p class="text-xs text-muted mb-1">Mystery</p>
        <p class="text-xs text-text leading-relaxed">
          {{ currentRiddle.question }}
        </p>
      </div>

      <!-- Options -->
      <div class="flex flex-col space-y-2">
        <Button
          v-for="(opt, i) in currentRiddle.options"
          :key="i"
          class="text-left w-full"
          :disabled="answered"
          :class="{ 'opacity-50': answered }"
          @click="answer(i)"
        >
          <span class="text-accent mr-1">{{ ['A', 'B', 'C', 'D'][i] }}.</span>
          {{ opt }}
        </Button>
      </div>
    </div>

    <!-- Single question result -->
    <div v-else-if="phase === 'result'" class="text-center">
      <!-- Progress point -->
      <div class="flex justify-center space-x-1.5 mb-3"><div v-for="i in 5" :key="i" class="w-2 h-2" :class="dotClass(i - 1)" />
      </div>

      <div :class="lastCorrect ? 'correct-flash' : 'wrong-shake'" class="mb-3 py-3 border border-accent/20">
        <p class="text-sm mb-1" :class="lastCorrect ? 'text-success' : 'text-danger'">
          {{ lastCorrect ? 'Correct! +100文' : 'Wrong answer...' }}
        </p><p class="text-xs text-muted mt-1">
          Correct answer:
          <span class="text-accent">{{ currentRiddle.options[currentRiddle.answer] }}</span>
        </p>
      </div>
      <p class="text-xs text-muted">
        Current score:
        <span class="text-accent">{{ score }}</span>
        text
      </p>
    </div>

    <!-- Final result -->
    <div v-else>
      <p class="text-xs text-muted mb-2">The lantern riddle party is over! </p>

      <!-- Progress point (final state) -->
      <div class="flex justify-center space-x-1.5 mb-3">
        <div v-for="i in 5" :key="i" class="w-2 h-2" :class="dotClass(i - 1)" />
      </div>

      <div class="border border-accent/20 p-3 mb-3 text-center">
        <p class="text-xs mb-1">
          Correct answer:
          <span class="text-success">{{ correctCount }}</span>
          / 5 questions
        </p>
        <p class="text-xs">
          Total bonus:
          <span class="text-accent">{{ score }}</span>
          text
          <span v-if="correctCount === 5" class="text-accent finish-flash">(all correct + 300 texts!)</span>
        </p>
      </div>
      <Button class="w-full" @click="handleClaim">Claim rewards</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUnmounted } from 'vue'
  import { Lightbulb, Lamp, Timer } from 'lucide-vue-next'
  import {
    sfxGameStart,
    sfxRewardClaim,
    sfxCountdownTick,
    sfxCountdownFinal,
    sfxRiddleReveal,
    sfxRiddleWrong,
    sfxMiniGood,
    sfxMiniPerfect
  } from '@/composables/useAudio'
  import Button from '@/components/game/Button.vue'

  const emit = defineEmits<{ complete: [prize: number] }>()

  type Phase = 'ready' | 'showing' | 'answering' | 'result' | 'finished'
  const phase = ref<Phase>('ready')

  interface Riddle {
    question: string
    options: string[]
    answer: number
  }

  const RIDDLE_POOL: Riddle[] = [
    // === Traditional lantern riddles ===
    {
      question: 'Has a face but no mouth, has feet but no hands, listens to people talk, and drinks with others. (Pack daily necessities)',
      options: ['table', 'chair', 'teapot', 'lantern'],
      answer: 0
    },
    {
      question: 'Thousands of lines, ten thousand lines, invisible when dropped into water. (Hit a natural phenomenon)',
      options: ['wind', 'rain', 'snow', 'fog'],
      answer: 1
    },
    {
      question: 'Wearing green clothes, her belly is watery, she has many children, and they all have dark faces. (beat a piece of fruit)',
      options: ['grape', 'watermelon', 'pomegranate', 'lychee'],
      answer: 1
    },
    {question: 'Red rooster, green tail, body burrowed into the ground. (beat a vegetable)',
      options: ['carrot', 'white radish', 'sweet potato', 'peanut'],
      answer: 0
    },
    {
      question: 'Seven or eight brothers were sitting around a pillar. When everyone broke up, their clothes were all torn. (Pick a piece of food)',
      options: ['dumplings', 'baozi', 'garlic', 'orange'],
      answer: 2
    },
    {
      question: 'Wearing a red hat and a white robe, he walks with airs and stretches his neck when talking. (Hit an animal)',
      options: ['chicken', 'goose', 'crane', 'parrot'],
      answer: 1
    },
    {
      question: 'One thing has three mouths, it has legs but no hands. Without it, it is difficult to see relatives and friends. (Hit one clothing)',
      options: ['hat', 'pants', 'shoes', 'gloves'],
      answer: 1
    },
    {
      question: 'A little girl, sitting in the middle of the water, wearing a pink coat, emitting fragrance. (Hit a plant)',
      options: ['water lily', 'lotus', 'chrysanthemum', 'orchid'],
      answer: 1
    },
    {
      question: 'An old man won't run away, and if you ask him to sleep, he will shake his head. (Hit an item)',
      options: ['Pendulum', 'Tumbler', 'Swing', 'Windmill'],
      answer: 1
    },
    {
      question: 'Has a head but no neck, eyes but no eyebrows, no legs to walk, no wings to fly. (Hit an animal)',
      options: ['snake', 'fish', 'silkworm', 'snail'],
      answer: 1
    },
    {question: 'My hunchbacked father-in-law is so powerful, what do you want to carry? Heavy traffic. (Hit something)',
      options: ['bridge', 'road', 'boat', 'car'],
      answer: 0
    },
    {
      question: 'I am not afraid of water above, and I am not afraid of fire below. Every kitchen has one. (Pick up a kitchen utensil)',
      options: ['chopping knife', 'pot', 'bowl', 'chopping board'],
      answer: 1
    },
    // === Chinese Culture/Festivals/Poetry ===
    {
      question: 'What does the "Chanjuan" in "May we live forever together thousands of miles apart" refer to? ',
      options: ['Beauty', 'Moon', 'Sun', 'Star'],
      answer: 1
    },
    {
      question: 'What is the Chinese Valentine's Day called again? ',
      options: ['Lantern Festival', 'Hua Chao Festival', 'Qiqiao Festival', 'Shangsi Festival'],
      answer: 2
    },
    {
      question: 'Which poet came from "One Year Old Amidst the Sound of Firecrackers"? ',
      options: ['Li Bai', 'Du Fu', 'Su Shi', 'Wang Anshi'],
      answer: 3
    },
    {
      question: 'Which of the following is not included in the ancient "five grains"? ',
      options: ['rice', 'wheat', 'cotton', 'millet'],
      answer: 2
    },
    {
      question: 'What is the next sentence of "It rains heavily during Qingming Festival"? ',
      options: ['Pedestrians on the road want to die', 'The shepherd boy points to Xinghua Village', 'May I ask where the restaurant is', 'A stranger in a foreign land'],
      answer: 0
    },{
      question: 'What is the festival on the fifth day of the fifth lunar month? ',
      options: ['Mid-Autumn Festival', 'Double Ninth Festival', 'Dragon Boat Festival', 'Qixi Festival'],
      answer: 2
    },
    {
      question: 'What is the next sentence of "Looking up at the bright moon"? ',
      options: ['Suspected to be frost on the ground', 'Bow your head and miss your hometown', 'The moon is the brightness of your hometown', 'Three people in the shadow'],
      answer: 1
    },
    {
      question: 'Which of the following does not include the "Four Treasures of the Study" in ancient times? ',
      options: ['pen', 'ink', 'paper', 'ruler'],
      answer: 3
    },
    {
      question: 'What's the next sentence of "spring sleep without realizing the dawn"? ',
      options: ['I hear birds singing everywhere', 'How many flowers have fallen', 'The sound of wind and rain at night', 'The fragrance of flowers and grass in the spring breeze'],
      answer: 0
    },
    {
      question: 'Among the twenty-four solar terms, which solar term comes after the beginning of spring? ',
      options: ['Jingzhe', 'Rain', 'Vernal Equinox', 'Qingming'],
      answer: 1
    },
    {
      question: 'The ancients said, "Three Friends of Suihan", which three kinds of plants are they referring to? ',
      options: ['Mei Orchid Bamboo', 'Song Bamboo Plum', 'Lan Ju Mei', 'Song Lan Bamboo'],
      answer: 1
    },
    {
      question: 'What does the "bed" in "Moonlight in front of the bed" most likely refer to? ',
      options: ['bed', 'well rail', 'bed', 'window sill'],
      answer: 1
    },
    {
      question: 'What are the traditional customs of the Double Ninth Festival? ',
      options: ['eating glutinous rice balls', 'climbing high and looking into the distance', 'putting river lanterns', 'outing'],
      answer: 1
    },
    {
      question: 'What's the next sentence of "I don't know where to go"? ',
      options: ['The peach blossoms still laugh at the spring breeze', 'The spring breeze does not pass through Yumen Pass', 'Flowers bloom and fall in two ways', 'See you again when the flowers fall'],
      answer: 0
    },
    {
      question: 'Who do we eat rice dumplings to commemorate during the Dragon Boat Festival? ',
      options: ['Confucius', 'Qu Yuan', 'Li Bai', 'Zhuge Liang'],
      answer: 1
    },
    {
      question: 'What is the next sentence of "picking chrysanthemums under the eastern fence"? ',
      options: ['See Nanshan leisurely', 'Wine to ask the blue sky', 'Fishing alone in the snow in the cold river', 'The river is as green as blue in spring'],
      answer: 0
    },
    // === Nature/Farming/Animals ===
    {
      question: 'The round face is like an apple, sour, sweet and nutritious. It can be eaten as a vegetable or as a fruit. (Punch a fruit and vegetable)',
      options: ['tomato', 'apple', 'peach', 'apricot'],
      answer: 0
    },
    {question: 'Look at the circle, feel the numbness, and it is surrounded by a small crescent moon. (Pick a piece of food)',
      options: ['walnut', 'peanut', 'orange', 'pomegranate'],
      answer: 2
    },
    {
      Question: 'My fair and tender baby, blow bubbles in the bath, wash your body, and then wash it and it will disappear. (Pack daily necessities)',
      options: ['Towel', 'Soap', 'Toothpaste', 'Sachet'],
      answer: 1
    },
    {
      question: 'A bamboo pipe is two feet long, with seven small round windows opened. If you blow it at one window, the sound of the music will spread in all directions. (play an instrument)',
      options: ['Xiao', 'Dizi', 'Xun', 'Pipa'],
      answer: 1
    },
    {
      question: 'It is said that it is a cow and cannot pull a plow; it is said that it is weak but can carry a house on its back. (Hit an animal)',
      options: ['snail', 'rhino', 'buffalo', 'ant'],
      answer: 0
    },
    {
      question: 'It has wings but is not a bird. It has legs and cannot run. It lives in a tree without a nest and sings like a cyborg. (Hit an insect)',
      options: ['bee', 'butterfly', 'cicada', 'cricket'],
      answer: 2
    },
    {
      question: 'Four flowers with two leaves, white and yellow in color, bloom once a year and release fragrance in August. (Hit a plant)',
      options: ['Orchid', 'Chrysanthemum', 'Osmanthus', 'Lotus'],
      answer: 2
    },
    {
      question: 'There is a square city with one hundred thousand soldiers living in it. Generals are sent to attack, and thousands of horses gallop to kill the enemy. (Hit an item)',
      options: ['Chessboard', 'Abacus', 'Seal', 'Inkstone'],answer: 0
    }
  ]

  /** 7 seconds for the first 2 questions, 6 seconds for the last 3 questions */
  const currentTimeLimit = ref(7)

  const gameRiddles = ref<Riddle[]>([])
  const currentIndex = ref(0)
  const countdown = ref(7)
  const score = ref(0)
  const correctCount = ref(0)
  const lastCorrect = ref(false)
  const answered = ref(false)
  const results = ref<(boolean | null)[]>([null, null, null, null, null])

  let countdownTimer: ReturnType<typeof setInterval> | null = null
  let phaseTimeout: ReturnType<typeof setTimeout> | null = null

  const currentRiddle = ref<Riddle>(RIDDLE_POOL[0]!)

  const dotClass = (idx: number) => {
    const r = results.value[idx]
    if (r === true) return 'bg-success'
    if (r === false) return 'bg-danger'
    if (idx === currentIndex.value && phase.value !== 'finished') return 'bg-accent dot-pulse'
    return 'bg-accent/20'
  }

  const pickRiddles = (): Riddle[] => {
    const pool = [...RIDDLE_POOL]
    const picked: Riddle[] = []
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * pool.length)
      picked.push(pool.splice(idx, 1)[0]!)
    }
    return picked
  }

  const startGame = () => {
    sfxGameStart()
    gameRiddles.value = pickRiddles()
    currentIndex.value = 0
    score.value = 0
    correctCount.value = 0results.value = [null, null, null, null, null]
    showNextRiddle()
  }

  const showNextRiddle = () => {
    currentRiddle.value = gameRiddles.value[currentIndex.value]!
    answered.value = false
    currentTimeLimit.value = currentIndex.value < 2 ? 7 : 6
    sfxRiddleReveal()
    phase.value = 'showing'
    phaseTimeout = setTimeout(() => {
      phase.value = 'answering'
      countdown.value = currentTimeLimit.value
      countdownTimer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 3 && countdown.value > 0) sfxCountdownFinal()
        else if (countdown.value > 3) sfxCountdownTick()
        if (countdown.value <= 0) {
          answer(-1)
        }
      }, 1000)
    }, 800)
  }

  const answer = (choice: number) => {
    if (answered.value) return
    answered.value = true

    if (countdownTimer) clearInterval(countdownTimer)
    countdownTimer = null

    const correct = choice === currentRiddle.value.answer
    lastCorrect.value = correct
    results.value[currentIndex.value] = correct
    if (correct) {
      sfxMiniGood()
      correctCount.value++
      score.value += 100
    } else {
      sfxRiddleWrong()
    }
    phase.value = 'result'

    phaseTimeout = setTimeout(() => {
      currentIndex.value++
      if (currentIndex.value >= 5) {
        if (correctCount.value === 5) {
          score.value += 300
          sfxMiniPerfect()
        }
        phase.value = 'finished'
      } else {
        showNextRiddle()
      }
    }, 1500)
  }

  const handleClaim = () => {
    sfxRewardClaim()
    emit('complete', score.value)
  }

  onUnmounted(() => {
    if (countdownTimer) clearInterval(countdownTimer)
    if (phaseTimeout) clearTimeout(phaseTimeout)
  })</script>

<style scoped>
  .lantern-drop {
    animation: lantern-drop 0.6s ease-out;
  }

  @keyframes lantern-drop {
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }
    60% {
      transform: translateY(3px);
      opacity: 1;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .dot-pulse {
    animation: dot-pulse 1s ease-in-out infinite;
  }

  @keyframes dot-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  .time-pulse {
    animation: time-pulse 0.5s ease-in-out infinite;
  }

  @keyframes time-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .correct-flash {
    animation: correct-flash 0.4s ease-in-out;
  }

  @keyframes correct-flash {
    0% {
      background-color: transparent;
    }
    30% {
      background-color: rgba(90, 158, 111, 0.2);
    }
    100% {
      background-color: transparent;
    }
  }

  .wrong-shake {
    animation: wrong-shake 0.4s ease-in-out;
  }

  @keyframes wrong-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-4px);
    }
    40% {
      transform: translateX(4px);
    }
    60% {
      transform: translateX(-3px);}
    80% {
      transform: translateX(3px);
    }
  }

  .finish-flash {
    animation: finish-flash 0.6s ease-in-out 3;
  }

  @keyframes finish-flash {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }
</style>