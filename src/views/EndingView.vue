<template>
  <div class="ending-screen" :style="{ background: endingStyle.background }">
    <div class="ending-content">
      <div class="ending-badge" :style="{ color: endingStyle.accent }">{{ endingData.badge }}</div>
      <h1 class="ending-title" :style="{ color: endingStyle.accent }">{{ endingData.title }}</h1>
      <h2 class="ending-subtitle">{{ endingData.subtitle }}</h2>
      <p class="ending-text">{{ endingData.text }}</p>
      <button class="restart-btn" :style="{ borderColor: endingStyle.accent, color: endingStyle.accent }" @click="$emit('restart')">
        再来一局
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EndingId } from '../types/game'

const props = defineProps<{ endingId: EndingId }>()
defineEmits<{ restart: [] }>()

interface EndingData {
  badge: string
  title: string
  subtitle: string
  text: string
}

interface EndingStyle {
  background: string
  accent: string
}

const ENDINGS: Record<EndingId, EndingData> = {
  e1: {
    badge: '镇压结局',
    title: '血雨腥风',
    subtitle: '秘密终被血煞堂利用，江湖无处容身',
    text: '那个秘密如同投入湖中的石子，涟漪扩散，再无法收拾。血煞堂的追杀令在江湖中流传，每一张告示都写着你的名字。你曾以为可以独自承担一切，却不知人心比刀锋更为锋利。夜宿荒野，昼伏人烟，走过多少城镇，身后的追兵便如影随形。那些曾经的盟友一一闭门不迎，江湖的规矩便是——败者，无路可走。你握紧腰间的剑，向前踏出最后一步，身后是滚滚血雨，眼前是未知的深渊。',
  },
  e2: {
    badge: '正道结局',
    title: '朗朗乾坤',
    subtitle: '联手青云，正义终归大胜',
    text: '姜鹤年站在青云门的山门前，向你郑重一揖。那一揖，压下了多少年的沉默与隐忍。你将一切告知于他，他将一切告知于江湖。从太虚观到荒原帮，从朝廷密探到市井小民，真相如同破晓时分的第一缕阳光，驱散了遮盖已久的阴霾。那些参与密谋者被一一绳之以法，那些被压迫的无辜者重新抬起头颅。你与青云门并肩而立，风吹过山岗，衣袂飘扬，这一刻，江湖清明，朗朗乾坤。',
  },
  e3: {
    badge: '太虚结局',
    title: '云中太虚',
    subtitle: '被玄机子赏识，步入太虚观门墙',
    text: '玄机子将那枚刻有太虚观印记的玉牌递来时，你明白这既是机遇，也是枷锁。他的眼中有你看不透的深意，而你身上的秘密恰恰是他所需要的棋子。太虚观清风送爽，香烟袅袅，表面与世无争，内里却是权力最深处的漩涡。你学得道法，通晓星相，渐渐在这云雾之上找到了自己的位置。那些曾经的惶惶不安，被钟声与晨课一一磨平。你成为了太虚的一部分，而太虚，也成为了你的宿命。',
  },
  e4: {
    badge: '血煞结局',
    title: '刀口余生',
    subtitle: '与陆铭达成协议，走上血煞堂之路',
    text: '陆铭将那份协议推至你面前时，你沉默了良久。他说：「我不杀无辜，你也不是。」这句话成了你们之间最初的默契。血煞堂的规矩残酷，但陆铭守着他那一份底线，你亦守着自己的尺度。渐渐地，你懂得了在这黑白之间的灰色地带如何存活，也懂得了何为真正的生死情谊。江湖不只有正邪之分，有时候，能活下去本身就已是最大的胜利。你与陆铭走在长街之上，夜风刮过，两把刀，一段路。',
  },
  e5: {
    badge: '江湖浪人',
    title: '天涯共此时',
    subtitle: '与沈如玉远走，浪迹天涯',
    text: '沈如玉说：「我们走吧，去一个没有秘密、没有追杀的地方。」你望着她眼中那一点不肯熄灭的光，终于点了点头。那些纷争、那些恩怨，随着两人离开江湖的脚步渐渐模糊。青山碧水，烟火人间，有时是渔村的早市，有时是山野的篝火。她依旧偏执，你依旧沉默，但在彼此身边，那些棱角都变得柔软起来。江湖的故事仍在继续，只是已与你们无关。你握着她的手，走向连自己也未曾料想的远方，再不回头。',
  },
  e6: {
    badge: '朝廷暗探',
    title: '暗流之下',
    subtitle: '被纪晚棠引荐，成为朝廷密探',
    text: '纪晚棠揭下那张商人的面具时，你才发现自己早已置身于比江湖更深的棋局之中。朝廷的意图从来不透明，但纪晚棠给出了一个你无法拒绝的条件——庇护、身份、和那个秘密永远不再被人追究。你换了一件新衣，学会了另一副面孔。你穿行于江湖与朝堂之间，所见之事渐渐不再令你心悸。那些你曾认为非黑即白的判断，在权力的磨砺下变得愈加复杂。只是偶尔夜深，你仍会想起最初那个只想守护一份真相的自己。',
  },
  e7: {
    badge: '孤身隐世',
    title: '一念归山',
    subtitle: '独自远遁，不问江湖事',
    text: '你收拾了简单的行囊，没有告别，没有宣言，只是在一个清晨悄然离开。江湖的恩怨太重，人心的算计太深，你已厌倦了那些看不见底的深渊。踏过荒原，越过雪岭，在一处无人知晓的山谷中停了下来。溪水清透，薜荔攀墙，岁月在这里变得极轻极慢。你不再是任何人的棋子，也不必向任何人交代。那个秘密，那些旧人，随着时光的流逝，终将化作尘烟。一念放下，便是江湖之外，自在余生。',
  },
}

const STYLES: Record<EndingId, EndingStyle> = {
  e1: { background: 'linear-gradient(160deg, #1a0505 0%, #3d0a0a 50%, #1a0505 100%)', accent: '#c0392b' },
  e2: { background: 'linear-gradient(160deg, #1a1505 0%, #3d3210 50%, #1a1505 100%)', accent: '#f0c040' },
  e3: { background: 'linear-gradient(160deg, #051520 0%, #0a2d40 50%, #051520 100%)', accent: '#4ab4c8' },
  e4: { background: 'linear-gradient(160deg, #150505 0%, #350c0c 50%, #150505 100%)', accent: '#a03030' },
  e5: { background: 'linear-gradient(160deg, #051505 0%, #0f3015 50%, #051505 100%)', accent: '#5cb85c' },
  e6: { background: 'linear-gradient(160deg, #0d0515 0%, #1e0b35 50%, #0d0515 100%)', accent: '#9b59b6' },
  e7: { background: 'linear-gradient(160deg, #0f0e0c 0%, #2a2520 50%, #0f0e0c 100%)', accent: '#a09080' },
}

const endingData = computed(() => ENDINGS[props.endingId])
const endingStyle = computed(() => STYLES[props.endingId])
</script>

<style scoped>
.ending-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
}

.ending-content {
  max-width: 640px;
  width: 90%;
  text-align: center;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.ending-badge {
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0.8;
}

.ending-title {
  font-size: 2.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  margin: 0;
  text-shadow: 0 0 24px currentColor;
}

.ending-subtitle {
  font-size: 1.05rem;
  color: #c8b89a;
  font-weight: 400;
  margin: 0;
  letter-spacing: 0.05em;
}

.ending-text {
  font-size: 0.95rem;
  line-height: 2;
  color: #d4c4a8;
  text-align: justify;
  margin: 0.5rem 0;
  max-width: 520px;
}

.restart-btn {
  margin-top: 1.5rem;
  padding: 0.65rem 2.5rem;
  background: transparent;
  border: 1.5px solid;
  border-radius: 2px;
  font-family: inherit;
  font-size: 0.95rem;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  opacity: 0.85;
}

.restart-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  opacity: 1;
}
</style>
