import type { DayEvent } from '../types/game'

export const DAY_EVENTS: DayEvent[] = [
  {
    day: 1, title: '驿站惊变',
    scene: '夜深人静，驿站后院突然传出两道压低的声音。侧耳细辨，竟是太虚观掌门与血煞堂执行者的秘密交易——这份足以颠覆正派联盟的内幕，就此落入你手中。',
    hasCombat: false,
    choices: [
      { id: 'c1-a', text: '伏身细听，将每字每句记牢', outcomes: [{ secretSpreadDelta: 2, flags: ['heard-deal-detail'] }] },
      { id: 'c1-b', text: '悄悄离开，此事知道得越少越安全', outcomes: [{ secretSpreadDelta: 0, flags: ['avoided-deal'] }] },
    ],
  },
  {
    day: 2, title: '青云门来访',
    scene: '翌日清晨，驿站外停了一队青云门旗号的车马。掌门姜鹤年亲自下马，目光精锐地向你望来，似乎察觉到了什么。',
    hasCombat: false,
    choices: [
      { id: 'c2-a', text: '以礼相见，表现得毫无异样', outcomes: [{ npcId: 'jiang-henian', affinityDelta: { trust: 10, awe: 5 } }] },
      { id: 'c2-b', text: '借口赶路，婉转推辞寒暄', outcomes: [{ npcId: 'jiang-henian', affinityDelta: { trust: -5, awe: 5 } }] },
    ],
  },
  {
    day: 3, title: '山路问路',
    scene: '官道旁，一个年轻的灵隐宗僧人坐在树根上，苦恼地翻看地图。见你路过，他抬头笑道："施主，前方去镇上可是向东走？"',
    hasCombat: false,
    choices: [
      { id: 'c3-a', text: '热心指路，与他攀谈片刻', outcomes: [{ npcId: 'huiming', affinityDelta: { trust: 10, intimacy: 8 } }] },
      { id: 'c3-b', text: '简短指路便离开，不多言', outcomes: [{ npcId: 'huiming', affinityDelta: { trust: 5 } }] },
    ],
  },
  {
    day: 4, title: '太虚弟子现身',
    scene: '暮色中，一名素衣女子出现在路口，步伐轻盈，回头望了你一眼，似有意又似无意。那是太虚观弟子凌霜——她的出现绝非偶然。',
    hasCombat: false,
    choices: [
      { id: 'c4-a', text: '主动上前搭话，试探她的来意', outcomes: [{ npcId: 'lingshuang', affinityDelta: { trust: 5, intimacy: 10 } }, { secretSpreadDelta: 1 }] },
      { id: 'c4-b', text: '绕道而行，假作未见', outcomes: [{ npcId: 'lingshuang', affinityDelta: { dread: 5 } }] },
    ],
  },
  {
    day: 5, title: '荒路突袭',
    scene: '行至荒僻山道，前方几名持刀壮汉拦住去路，腰间荒原帮标记清晰可见。领头者冷笑："独行的女子，把路费交出来，大爷放你过去。"',
    hasCombat: true,
    choices: [
      { id: 'c5-a', text: '拔剑迎战，让他们见识一下内功', outcomes: [{ npcId: 'yan-sandao', affinityDelta: { dread: 10 } }, { flags: ['fought-huangyuan'] }] },
      { id: 'c5-b', text: '扔出银两买路，多一事不如少一事', outcomes: [{ npcId: 'yan-sandao', affinityDelta: { dread: 5 } }, { flags: ['bribed-huangyuan'] }] },
    ],
  },
  {
    day: 6, title: '市井情报',
    scene: '镇上的茶馆里，一个相貌普通的男子在你旁边坐下，轻声道："叶姑娘，我是顾长风。江湖上有些消息，不知你有没有兴趣？"',
    hasCombat: false,
    choices: [
      { id: 'c6-a', text: '花钱购买他手头的情报', outcomes: [{ npcId: 'gu-changfeng', affinityDelta: { trust: 15, intimacy: 5 } }, { flags: ['bought-intel-day6'] }] },
      { id: 'c6-b', text: '反问他为何知晓你的名字', outcomes: [{ npcId: 'gu-changfeng', affinityDelta: { trust: 5, intimacy: 10 } }] },
    ],
  },
  {
    day: 7, title: '血影追踪',
    scene: '一连三日，你在不同地点都瞥见同一个身影——穿灰色劲装、刀茧厚重，正是陆铭。被血煞堂监视的滋味如芒刺在背。',
    hasCombat: false,
    choices: [
      { id: 'c7-a', text: '设下假路线，试图甩掉对方', outcomes: [{ npcId: 'lu-ming', affinityDelta: { dread: -5 } }, { flags: ['evaded-lu-ming'] }] },
      { id: 'c7-b', text: '在僻静处停下等他靠近，当面对峙', outcomes: [{ npcId: 'lu-ming', affinityDelta: { dread: 10, trust: 5 } }, { secretSpreadDelta: 1 }] },
    ],
  },
  {
    day: 8, title: '古刹借宿',
    scene: '灵隐宗山门前，了尘大师亲自迎出，一双悲悯的眼睛仿佛看穿了你七日来的辛苦。"施主面有惊色，但请入寺安歇。"',
    hasCombat: false,
    choices: [
      { id: 'c8-a', text: '借宿之机，将驿站所听之事如实相告', outcomes: [{ npcId: 'liaoChen-dashi', affinityDelta: { trust: 20, awe: 5 } }, { secretSpreadDelta: 2, flags: ['told-liaoChen'] }] },
      { id: 'c8-b', text: '道谢借宿，对秘密一字不提', outcomes: [{ npcId: 'liaoChen-dashi', affinityDelta: { trust: 10, awe: 10 } }] },
    ],
  },
  {
    day: 9, title: '玄机突访',
    scene: '了尘大师尚未给你答复，太虚观掌门玄机子便突然来访。他与了尘并排而坐，眼角余光却始终落在你身上，笑道："这位想必就是刑部叶侍郎的千金？"',
    hasCombat: false,
    choices: [
      { id: 'c9-a', text: '坦然应对，谈吐得体，不露破绽', outcomes: [{ npcId: 'xuanji-zi', affinityDelta: { awe: 10, dread: 5 } }] },
      { id: 'c9-b', text: '借口不适，尽快告退', outcomes: [{ npcId: 'xuanji-zi', affinityDelta: { dread: 10 } }, { secretSpreadDelta: 1 }] },
    ],
  },
  {
    day: 10, title: '密探现身',
    scene: '寺中花园，一个"商人"模样的人走近你，压低声音道："在下纪晚棠，朝廷的人。叶姑娘，你知道的那些事，朝廷也需要知道。"',
    hasCombat: false,
    choices: [
      { id: 'c10-a', text: '试探性地承认知道一些事', outcomes: [{ npcId: 'ji-wantang', affinityDelta: { trust: 10, dread: 5 } }, { secretSpreadDelta: 1 }] },
      { id: 'c10-b', text: '否认，并反问他凭什么这样说', outcomes: [{ npcId: 'ji-wantang', affinityDelta: { trust: -5, dread: 15, intimacy: 5 } }] },
    ],
  },
  {
    day: 11, title: '如玉来访',
    scene: `沈如玉只身来到灵隐宗，眼中燃着火光："师叔说你可能知道太虚观的秘密——那些'意外身亡'的侠士，是不是真的意外？"`,
    hasCombat: false,
    choices: [
      { id: 'c11-a', text: '将所知的部分情况告诉她', outcomes: [{ npcId: 'shen-ruyu', affinityDelta: { trust: 20, intimacy: 10 } }, { secretSpreadDelta: 2 }] },
      { id: 'c11-b', text: '告诉她这件事比她想象的更危险，劝她别查', outcomes: [{ npcId: 'shen-ruyu', affinityDelta: { trust: 5, intimacy: 15 } }] },
    ],
  },
  {
    day: 12, title: '无名警告',
    scene: '你的枕下压着一张字条："知秘者，速离。——友人"笔迹陌生，字条无署名，却透着一股不寒而栗的真诚。',
    hasCombat: false,
    choices: [
      { id: 'c12-a', text: '按字条指引，次日便动身离开此地', outcomes: [{ secretSpreadDelta: -1, flags: ['heeded-warning'] }] },
      { id: 'c12-b', text: '追查字条来源，等待幕后人现身', outcomes: [{ secretSpreadDelta: 1, flags: ['investigated-warning'] }] },
    ],
  },
  {
    day: 13, title: '凌霜求援',
    scene: '夜深，凌霜出现在你房门外，神色仓皇："我知道你知道了。玄机子命我监视你——但我不想这样下去了。你若能帮我找到离开太虚观的出路，我可以告诉你更多。"',
    hasCombat: false,
    choices: [
      { id: 'c13-a', text: '答应帮她，先听她说出更多内情', outcomes: [{ npcId: 'lingshuang', affinityDelta: { trust: 25, intimacy: 20 } }, { secretSpreadDelta: 1, flags: ['allied-lingshuang'] }] },
      { id: 'c13-b', text: '拒绝，告诉她你无法保证任何人的安全', outcomes: [{ npcId: 'lingshuang', affinityDelta: { trust: 5, dread: 10 } }] },
    ],
  },
  {
    day: 14, title: '江湖宴席',
    scene: '各派人物汇聚镇上，表面是为贺寿，实则暗流汹涌。酒过三巡，有人趁乱拔刀——你被卷进一场混战。',
    hasCombat: true,
    choices: [
      { id: 'c14-a', text: '护住离你最近的沈如玉', outcomes: [{ npcId: 'shen-ruyu', affinityDelta: { trust: 15, awe: 10 } }] },
      { id: 'c14-b', text: '趁乱脱身，不卷入任何一方', outcomes: [{ secretSpreadDelta: -1 }] },
    ],
  },
  {
    day: 15, title: '草莽情义',
    scene: '燕三刀独自找上门来，将一块令牌推到你面前："持此令牌，荒原帮境内你随意走。不要钱，但日后我若有所托，你得答应一件事。"',
    hasCombat: false,
    choices: [
      { id: 'c15-a', text: '接受令牌，约定日后互助', outcomes: [{ npcId: 'yan-sandao', affinityDelta: { trust: 20, awe: 15 } }, { flags: ['huangyuan-pact'] }] },
      { id: 'c15-b', text: '礼貌拒绝，不接受未知的承诺', outcomes: [{ npcId: 'yan-sandao', affinityDelta: { trust: 5, awe: 10 } }] },
    ],
  },
  {
    day: 16, title: '长辈盘问',
    scene: '姜鹤年借商议江湖事务之机，单独将你留下，长叹一声："年轻人，有些事知道了便无法置身事外——你现在是哪种处境？"',
    hasCombat: false,
    choices: [
      { id: 'c16-a', text: '承认自己知道了一些事，请他指点', outcomes: [{ npcId: 'jiang-henian', affinityDelta: { trust: 15, awe: 5 } }, { secretSpreadDelta: 1 }] },
      { id: 'c16-b', text: '坚称自己只是回京待嫁的女子，别无他求', outcomes: [{ npcId: 'jiang-henian', affinityDelta: { trust: -5, awe: 10 } }] },
    ],
  },
  {
    day: 17, title: '血煞条件',
    scene: '陆铭拦路，语气平静如谈生意："姑娘，我家堂主说了，你若愿意将那夜所听如实告知我们，血煞堂保你平安回京、婚事顺利。"',
    hasCombat: false,
    choices: [
      { id: 'c17-a', text: '假意谈判，摸清血煞堂的真实意图', outcomes: [{ npcId: 'lu-ming', affinityDelta: { trust: 10, dread: -5 } }, { flags: ['negotiated-xueshao'] }] },
      { id: 'c17-b', text: '断然拒绝，转身便走', outcomes: [{ npcId: 'lu-ming', affinityDelta: { dread: 15 } }, { flags: ['refused-xueshao'] }] },
    ],
  },
  {
    day: 18, title: '密探棋局',
    scene: '纪晚棠摆出棋盘，笑道："不如下一局，输的人回答一个问题——如实回答。"棋局是假，试探是真。',
    hasCombat: false,
    choices: [
      { id: 'c18-a', text: '认真对弈，以棋局作掩护说出部分真相', outcomes: [{ npcId: 'ji-wantang', affinityDelta: { trust: 15, intimacy: 15 } }, { secretSpreadDelta: 1 }] },
      { id: 'c18-b', text: '故意输掉，用一个无关紧要的秘密结束对局', outcomes: [{ npcId: 'ji-wantang', affinityDelta: { trust: 5, dread: 5, intimacy: 10 } }] },
    ],
  },
  {
    day: 19, title: '慧明抉择',
    scene: '慧明找到你，面色平静地说："我打算还俗。了尘师父知道比他表现的更多，却选择什么都不做——我不能接受这样的中立。"',
    hasCombat: false,
    choices: [
      { id: 'c19-a', text: '支持他，告诉他你理解这种选择', outcomes: [{ npcId: 'huiming', affinityDelta: { trust: 15, intimacy: 20 } }, { flags: ['huiming-left-sect'] }] },
      { id: 'c19-b', text: '劝他再想想，中立未必是懦弱', outcomes: [{ npcId: 'huiming', affinityDelta: { trust: 10, intimacy: 5 } }] },
    ],
  },
  {
    day: 20, title: '顾长风急报',
    scene: '顾长风快马找来，面色难看："玄机子已经知道你知道了那夜的事——他在路上安排了人。你得今晚就动身。"',
    hasCombat: false,
    choices: [
      { id: 'c20-a', text: '立刻动身，趁夜离开此地', outcomes: [{ npcId: 'gu-changfeng', affinityDelta: { trust: 10, intimacy: 5 } }, { flags: ['fled-night'] }] },
      { id: 'c20-b', text: '先布置疑阵，拖延一日再走', outcomes: [{ secretSpreadDelta: -1, flags: ['set-decoy'] }] },
    ],
  },
  {
    day: 21, title: '玄机邀谈',
    scene: '玄机子差人送来一张帖子："邀叶姑娘月下茶叙，共商雍朝江湖之未来。"是赴约以观虚实，还是拒绝？',
    hasCombat: false,
    choices: [
      { id: 'c21-a', text: '赴约，以观其虚实', outcomes: [{ npcId: 'xuanji-zi', affinityDelta: { awe: 15, dread: 15 } }, { flags: ['met-xuanji-private'] }] },
      { id: 'c21-b', text: '婉拒，另寻出路', outcomes: [{ npcId: 'xuanji-zi', affinityDelta: { dread: 20 } }, { secretSpreadDelta: 1 }] },
    ],
  },
  {
    day: 22, title: '宗门内争',
    scene: '灵隐宗内，了尘大师与几名长老正在争吵——是否应当公开太虚观与血煞堂的关系。了尘持保留意见，你该如何？',
    hasCombat: false,
    choices: [
      { id: 'c22-a', text: '站出来支持公开真相', outcomes: [{ npcId: 'liaoChen-dashi', affinityDelta: { trust: -5, awe: 5 } }, { secretSpreadDelta: 2, flags: ['supported-disclosure'] }] },
      { id: 'c22-b', text: '私下劝了尘，等待更好时机', outcomes: [{ npcId: 'liaoChen-dashi', affinityDelta: { trust: 10, intimacy: 5 } }] },
    ],
  },
  {
    day: 23, title: '七娘往事',
    scene: '柳七娘与你同坐营火旁，讲起她被正派驱逐的往事——她曾是青云门最有前途的弟子，只因揭发掌门私吞赏金，便被扣上"妖女"之名逐出。',
    hasCombat: false,
    choices: [
      { id: 'c23-a', text: '告诉她你处境相似，引为同道', outcomes: [{ npcId: 'liu-qiniang', affinityDelta: { trust: 20, intimacy: 25 } }, { flags: ['bonded-liu'] }] },
      { id: 'c23-b', text: '听完保持沉默，不轻易表态', outcomes: [{ npcId: 'liu-qiniang', affinityDelta: { trust: 10, awe: 10 } }] },
    ],
  },
  {
    day: 24, title: '如玉崩溃',
    scene: '沈如玉得知师叔姜鹤年早就知道太虚观异动却沉默多年，当场崩溃，哭着质问你："你为什么之前不把全部告诉我？！"',
    hasCombat: false,
    choices: [
      { id: 'c24-a', text: '陪着她，如实说出你所知道的一切', outcomes: [{ npcId: 'shen-ruyu', affinityDelta: { trust: 15, intimacy: 20 } }, { secretSpreadDelta: 2 }] },
      { id: 'c24-b', text: '先安抚她的情绪，让她冷静后再谈', outcomes: [{ npcId: 'shen-ruyu', affinityDelta: { intimacy: 10 } }] },
    ],
  },
  {
    day: 25, title: '血煞截杀',
    scene: '山路窄处，五名血煞堂杀手突然现身。为首者面无表情，手中摆着你的画像："堂主说了，死要见尸。"',
    hasCombat: true,
    choices: [
      { id: 'c25-a', text: '正面迎战，以内功强行突围', outcomes: [{ npcId: 'lu-ming', affinityDelta: { dread: -10 } }, { flags: ['survived-ambush'] }] },
      { id: 'c25-b', text: '引入镇中人多处，借人证自保', outcomes: [{ npcId: 'lu-ming', affinityDelta: { trust: 5, dread: -5 } }, { secretSpreadDelta: 2, flags: ['exposed-xueshao'] }] },
    ],
  },
  {
    day: 26, title: '三方对峙',
    scene: '玄机子、姜鹤年、陆铭三人同时出现在你下榻之处。三方交锋，却都盯着你——你是这个局里唯一一张不受控制的牌。',
    hasCombat: false,
    choices: [
      { id: 'c26-a', text: '公开宣读驿站所听内容，当场摊牌', outcomes: [{ npcId: 'xuanji-zi', affinityDelta: { dread: 30 } }, { secretSpreadDelta: 3, flags: ['public-revelation'] }] },
      { id: 'c26-b', text: '保持沉默，等三方先自乱阵脚', outcomes: [{ secretSpreadDelta: -1 }] },
    ],
  },
  {
    day: 27, title: '凌霜出走',
    scene: '凌霜找到你，手里握着一封信："这是玄机子密约的原件，我偷出来了。我要离开太虚观——你帮我还是不帮我，现在必须告诉我。"',
    hasCombat: false,
    choices: [
      { id: 'c27-a', text: '帮她离开，接过信件保管', outcomes: [{ npcId: 'lingshuang', affinityDelta: { trust: 30, intimacy: 30 } }, { flags: ['has-original-doc', 'helped-lingshuang'] }] },
      { id: 'c27-b', text: '劝她将信交给了尘大师处理', outcomes: [{ npcId: 'lingshuang', affinityDelta: { trust: 10, awe: 15 } }, { flags: ['doc-to-liaoChen'] }] },
    ],
  },
  {
    day: 28, title: '掌门摊牌',
    scene: '姜鹤年独自来见你，开门见山："你知道得太多了，但我选择信任你。当年我选择沉默，是因为保全青云门的代价——现在是时候说清楚了。"',
    hasCombat: false,
    choices: [
      { id: 'c28-a', text: '接受他的解释，与他谈条件', outcomes: [{ npcId: 'jiang-henian', affinityDelta: { trust: 20, awe: 10 } }, { flags: ['alliance-qingyun'] }] },
      { id: 'c28-b', text: '告诉他无论理由，沉默就是共谋', outcomes: [{ npcId: 'jiang-henian', affinityDelta: { trust: -10, awe: 20, intimacy: 5 } }, { flags: ['rejected-qingyun'] }] },
    ],
  },
  {
    day: 29, title: '前夜选择',
    scene: '距离回京完婚还剩最后一日。秘密在你手中，有人想要它、有人要掩盖它、有人要毁掉它——而你，终于要做出最后的决定。',
    hasCombat: false,
    choices: [
      { id: 'c29-a', text: '决定公开一切，将证据交给可信之人', outcomes: [{ secretSpreadDelta: 2, flags: ['decided-reveal'] }] },
      { id: 'c29-b', text: '决定悄然销毁证据，平静回京完婚', outcomes: [{ secretSpreadDelta: -3, flags: ['decided-destroy'] }] },
    ],
  },
  {
    day: 30, title: '终局之日',
    scene: '第三十日，清晨的雾还没有散去。所有的抉择都已做出，所有的关系都已定型——结局，就在这最后的雾中等待。',
    hasCombat: false,
    choices: [],
  },
]
