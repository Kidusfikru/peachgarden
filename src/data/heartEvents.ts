import type { HeartEventDef } from '@/types'

/** All heart event definitions */
export const HEART_EVENTS: HeartEventDef[] = [
  // ============================================================
  // Liu Niang (liu_niang) - the village chief's daughter, gentle and intelligent
  // ============================================================
  {
    id: 'liu_niang_heart_3',
    npcId: 'liu_niang',
    requiredFriendship: 800,
    title: 'Poetry by the Stream',
    scenes: [
      {
        text: 'You walked along the Peach Blossom Stream and found Liu Niang under a weeping willow. She was leaning against a tree trunk, holding a yellowed volume of poetry in her hands. The breeze blew, and a few peach blossoms fell on the pages. '
      },
      {
        text: 'Liu Niang raised her head and smiled slightly: "Are you coming here to relax too? This is my favorite place to study. The sound of the stream is like the sound of a natural piano."'
      },
      {
        text: 'She opened the collection of poems and pointed to one of the poems: "Have you read this one? "The peach blossoms shine brightly. When the son returns, it is suitable for his family." Every time I read this, I imagine the mood of the ancients when they wrote this poem. "',
        choices: [
          {
            text: '"This poem is about the yearning for a better life, just like Taoyuan Township. "',
            friendshipChange: 120,
            response:
              Liu Niang's eyes lit up: "Do you think so too?" My father named this village Taoyuan Township because he hoped that it would be as beautiful as described in the poem. It’s great to meet someone who understands poetry. "'
          },
          {
            text: '"To be honest, I don't know much about ancient poetry..."',
            friendshipChange: 40,
            response: 'Liu Niang smiled softly: "It doesn't matter. The beauty of poetry lies in the feeling, not in whether you understand it or not. Would you like to sit down and listen to me read one? "'
          },
          {
            text: '"I prefer working to reading poetry. "',
            friendshipChange: -40,
            response: 'Liu Niang's smile faded a little: "Of course hard work is a good thing... However, it is also necessary to stop occasionally. "She lowered her head and continued to flip through the book of poems.'
          }
        ]
      },
      {
        text: 'The sunset gradually sets in the west, and golden light floats on the surface of the stream. Liu Niang closed her poetry book and stood up. '
      },
      {
        text: '"We had a great time chatting today. "She handed you a dried peach blossom sandwiched in the book, "Give it to you as a bookmark. If you have any sentences you don't understand in the future, feel free to ask me - let's just say we have made a pact as poetry friends. "She smiled and waved, and walked away along the path by the stream.'
      }
    ]
  },
  {
    id: 'liu_niang_heart_5',
    npcId: 'liu_niang',
    requiredFriendship: 1600,
    title: 'Secrets of Taoyuan',
    scenes: [
      {
        text: 'In the evening, Liu Niang found you with a solemn expression: "Are you free?" I want to take you to a place, and there are some things... I think I should tell you. "'
      },
      {
        text: 'She leads you to an old abandoned ancestral hall at the back of the village. Pushing open the creaking wooden door, there is an ancient stone tablet inside, which is covered with densely packed small characters. '
      },
      {
        text: '"This is the clan monument of Taoyuan Township. Liu Niang said softly, "It records events from two hundred years ago." Taoyuan Township is not an ordinary village - it was established by a group of people who traveled across the mountains and ridges to find this hidden valley to escape the war. They planted peach trees and built canals here, and vowed never to have anything to do with the disputes outside. "',
        choices: [
          {
            text: '"I see... No wonder this place is isolated from the world, like a paradise. "',
            friendshipChange: 120,
            response:
              Liu Niang nodded, her eyes slightly red: "Yes." My ancestors have kept this secret for generations. My father often said that the tranquility of Taoyuan Township was obtained with the sacrifices of countless people, and we must cherish it. "'
          },
          {
            text: '"Why are you telling me this? "',
            friendshipChange: 80,
            response:
              Liu Niang was silent for a moment and said softly: "Because since you came here, you have been working hard to run the farm and help the villagers." I think...you are a trustworthy person. Moreover, your grandfather also knew this back then. "'
          }
        ]
      },
      {
        text: 'Liu Niang walked to the stone tablet and gently brushed off the dust with her hands: "There is also a prophecy recorded on the tablet - "The rise and fall of Taoyuan depends on those who come after. If a sincere person cultivates this land again, Taoyuan can regain its former glory." My father has always believed that this person is you. "'
      },
      {
        text: 'When I walked out of the ancestral hall, it was dark and the sky was full of stars. Liu Niang looked back at you: "Thank you for being willing to listen to this. This secret...let's keep it together from now on. "Under the moonlight, her eyes are gentle but firm.'
      }
    ]
  },
  {
    id: 'liu_niang_heart_8',
    npcId: 'liu_niang',
    requiredFriendship: 2400,
    title: 'Peach Blossoms under the Moon',
    scenes: [
      {
        text: 'Late at night, you were awakened by a gentle knock on the door. When I opened the door, I saw a letter lying in front of the door, which read: "Tonight the moon is full, and we have an appointment in the peach garden." ——Liu Niang"'
      },
      {
        text: 'You come to the peach garden in the east of the village. The moonlight is like water, shining on the peach blossoms all over the sky, and the petals slowly fall in the night wind, like a silent rain of flowers. Liu Niang stood under the old peach tree in the center of the garden, wearing a plain dress with a newly bloomed peach blossom in her hair. '
      },
      {
        text: '"You are here. "She turned around, the moonlight reflected her face, "I've been waiting for you. "She took a few steps closer and her voice was as soft as if she was afraid of scattering the petals. "There are some words that I have been hiding in my heart for a long time..."'
      },
      {
        text: '柳娘低下头，双手绞着衣角："你来桃源乡之前，我以为我会一辈子守着这个小村庄，读我的诗，过平淡的日子。可是你来了以后，一切都不同了。我看着你开荒种田、帮助乡亲、让这片土地重新焕发生机……我的心里，也像是开了一片桃花。"她抬起头，眼中有泪光闪烁，"我……喜欢你。"',
        choices: [
          {
            text: '轻轻握住她的手："我也喜欢你，柳娘。从在溪边读诗的那天起。"',
            friendshipChange: 160,
            response:
              '柳娘的泪水终于落下，却笑得比桃花还灿烂："真的吗？我以为……我以为只是我一个人的心思。"她反握住你的手，十指相扣，"那从今以后，这片桃花园就是我们的约定之地。"'
          },
          {
            text: '"柳娘，我很感动，但我需要一些时间……"',
            friendshipChange: 0,
            response:
              '柳娘愣了一下，随即轻轻放开目光，微笑道："没关系，我等你。桃花每年都会开的……我的心意也不会变。"虽然在笑，但月光下她的眼眶微微泛红。'
          }
        ]
      },
      {
        text: '一阵夜风吹过，漫天桃花纷纷扬扬地落下。你和柳娘并肩站在花雨之中，月光温柔地笼罩着一切。这一刻，桃源乡真的像是人间仙境。远处隐约传来溪水的声音，像是这片土地在轻声祝福。'
      }
    ]
  },

  // ============================================================
  // 秋月 (qiu_yue) —— 渔家女，活泼开朗
  // ============================================================
  {
    id: 'qiu_yue_heart_3',
    npcId: 'qiu_yue',
    requiredFriendship: 800,
    title: '钓鱼比试',
    scenes: [
      {
        text: '秋月蹦蹦跳跳地跑过来，手里挥舞着两根鱼竿："嘿！闲着没事吧？跟我来，带你去一个好地方！保证你没去过！"不等你回答，她就拽着你的袖子往山里跑。'
      },
      {
        text: '穿过一片竹林，绕过几块大石头，眼前豁然开朗——一潭碧绿的深水，四周被巨石环抱，阳光透过树缝洒下斑驳的光影。水面平静如镜，偶尔有鱼跃出水面，泛起一圈圈涟漪。'
      },
      {
        text: '"这是我的秘密钓点！"秋月得意地叉着腰，"全村就我一个人知道！这里的鱼又大又肥，普通地方根本比不了。"她把一根鱼竿塞到你手里，眼睛亮晶晶的，"来吧，咱们比一场！谁在一炷香的时间内钓的鱼多，谁就赢！输的人请吃饭！"',
        choices: [
          {
            text: '"好啊！那我可不会让着你！"',
            friendshipChange: 120,
            response: '秋月哈哈大笑："这才对嘛！我最讨厌别人让着我了！来来来，准备好——开始！"她熟练地甩出鱼线，动作干净利落，一看就是行家。'
          },
          {
            text: '"我钓鱼技术不太行，你教教我吧。"',
            friendshipChange: 80,
            response:
              '秋月歪着脑袋看你，嘻嘻一笑："行吧，本姑娘大发慈悲教教你。看好了——手腕要轻，抛线要稳，最重要的是要有耐心。不过比试还是要比的！"'
          },
          {
            text: '"钓鱼有什么好比的……"',
            friendshipChange: -40,
            response: '秋月鼓起腮帮子，一脸不高兴："哼！钓鱼可是世界上最棒的事情！算了算了，不跟你计较，等你钓上一条大鱼就知道有多开心了！"'
          }
        ]
      },
      {
        text: '一炷香过后，你们数了数各自的收获。秋月钓了六条，你钓了三条。她笑得前仰后合："哈哈哈！你输啦！请我吃陈伯铺子里的桂花糕！不许赖账！"'
      },
      {
        text: '收拾鱼竿时，秋月忽然安静下来，望着水面说："其实……这个地方是我小时候爸妈带我来的。那时候我们一家三口坐在这里钓鱼，一坐就是一整天。"她回过头冲你笑了笑，"今天能跟你来这里，也很开心！下次再来比过！"'
      }
    ]
  },
  {
    id: 'qiu_yue_heart_5',
    npcId: 'qiu_yue',
    requiredFriendship: 1600,
    title: '雨夜心事',
    scenes: [
      {
        text: '连日的暴雨让溪水暴涨，全村人都躲在屋里。你路过秋月家时，发现她的门虚掩着，屋里没有点灯。'
      },
      {
        text: '推门进去，借着闪电的光，你看到秋月蜷缩在窗边，抱着膝盖，脸上有泪痕。她看到你，慌忙擦了擦脸："你……你怎么来了？我没事，就是……不太喜欢下雨天。"'
      },
      {
        text: '你在她旁边坐下。沉默了很久，秋月才开口，声音很轻，失去了平日的活力："三年前……也是这样的暴雨天。我爸妈说要去下游看看水势，然后就再也没有回来。"她的声音开始颤抖，"村里人说他们被洪水冲走了……找了好久，什么都没找到。"',
        choices: [
          {
            text: '默默把外套披在她肩上，安静地陪着她。',
            friendshipChange: 160,
            response:
              '秋月愣了一下，然后眼泪再也忍不住了。她靠在你的肩膀上，哭了很久很久。等她平静下来，小声说："谢谢你……从他们走后，我一直告诉自己要笑着，不能让别人担心。可是下雨天的时候……我真的好想他们。"'
          },
          {
            text: '"秋月……你不用一个人扛着，难过的时候可以找我。"',
            friendshipChange: 120,
            response:
              '秋月的嘴角抖了抖，终于没忍住哭了出来："我……我一直以为自己很坚强。可是每次下雨，我就会想……如果那天我拦住他们，是不是一切都会不同？"她抹着眼泪，"你真的愿意听我说这些吗？"'
          }
        ]
      },
      {
        text: '雨渐渐小了，天边裂开一道缝，透出一缕微弱的光。秋月抬起头，红着眼睛看着那道光："我妈以前总说，雨后一定会出太阳。她还说，只要我一直笑着，他们就会在天上看着我笑。"'
      },
      {
        text: '秋月站起来，深吸一口气，然后转过身，露出一个虽然还带着泪水但已经明亮起来的笑容："好了！秋月才不会一直哭哭啼啼的呢！明天雨停了，我们去钓鱼吧。我爸妈最高兴看到我开开心心地钓鱼了。"她的眼睛闪着光，"而且……有你在，下雨天好像也没那么可怕了。"'
      }
    ]
  },
  {
    id: 'qiu_yue_heart_8',
    npcId: 'qiu_yue',
    requiredFriendship: 2400,
    title: '夕照归舟',
    scenes: [
      {
        text: '秋月一大早就来找你，背着一个大竹篓，竹篓里塞得满满当当——鱼竿、鱼饵、干粮、还有一壶茶。"今天跟我出远门！去桃花溪下游的芦苇荡！我要教你我妈的独门绝技！"'
      },
      {
        text: '你们划着秋月家的小木船顺流而下。秋月坐在船头，双脚荡在水里，哼着一首渔歌。芦苇荡在金色的阳光下摇曳，水鸟不时掠过水面。"这首歌是我妈教我的，"她说，"她说唱着这首歌，鱼儿就会自己游过来。"'
      },
      {
        text: '到了一片开阔的水域，秋月认真起来。她手把手教你一种特殊的抛线方式——鱼线在空中画出一个漂亮的弧线，轻轻落在水面上，几乎没有溅起水花。"这叫「柳叶钩」，是我妈发明的。要诀是——手要像柳枝一样柔软，心要像湖水一样平静。"',
        choices: [
          {
            text: '认真学习，反复练习，直到抛出一个完美的柳叶钩。',
            friendshipChange: 120,
            response:
              '秋月看着你的鱼线在空中画出完美的弧线，眼睛睁得大大的："哇！你居然一下午就学会了！我当初练了整整一个月呢！"她开心得手舞足蹈，差点把船晃翻，"我妈要是看到了，肯定也会夸你的！"'
          },
          {
            text: '"这个技巧真厉害。你妈妈一定是个很了不起的人。"',
            friendshipChange: 120,
            response:
              '秋月用力地点点头，眼里闪着骄傲和思念交织的光："她是全桃源乡最厉害的钓手！比我还厉害一百倍！……我一直想把她的本事全学会，然后教给更多的人。这样她就永远不会被忘记。"'
          }
        ]
      },
      {
        text: '夕阳西下，整个芦苇荡被染成了橘红色。你们收了鱼竿，让小船在水面上慢慢地漂。秋月坐在船头，夕阳把她的侧脸映得柔和而明亮。'
      },
      {
        text: '忽然，秋月转过身来，认真地看着你。夕阳在她的眼睛里跳动。"我一直在想该怎么说……"她难得地有些扭捏，用手指绕着发梢，"你知道吗？自从你来了桃源乡，我每天都特别特别开心。以前我觉得自己一个人也可以，可是现在……"她深吸一口气，然后一股脑地说出来，"我喜欢你！超级喜欢！比喜欢钓鱼还喜欢！这已经是我能说出的最高级别的喜欢了！"说完她涨红了脸，把头埋进膝盖里。'
      }
    ]
  },

  // ============================================================
  // 阿石 (a_shi) —— 矿工，沉默寡言
  // ============================================================
  {
    id: 'a_shi_heart_3',
    npcId: 'a_shi',
    requiredFriendship: 800,
    title: '矿洞救援',
    scenes: [
      {
        text: '你正在矿洞深处采矿，忽然听到前方传来一声闷响，紧接着是岩石崩落的声音。你循着声音跑过去，在一处塌方的岩壁旁发现了阿石——他的左腿被一块落石压住，额头上有一道血痕，却咬着牙一声不吭。'
      },
      {
        text: '看到你，阿石微微皱了皱眉："……你怎么在这里。"他顿了顿，"别过来，可能还会塌。"',
        choices: [
          {
            text: '不顾他的劝阻，立刻冲过去搬开压在他腿上的石头。',
            friendshipChange: 160,
            response:
              '阿石愣住了，想说什么却没说出口。你用尽全力搬开了落石，扶他靠在安全的岩壁上。他低着头沉默了好一会儿，才挤出两个字："……谢谢。"'
          },
          {
            text: '"我去叫人来帮忙！你等着！"',
            friendshipChange: 80,
            response:
              '阿石张了张嘴，最终没有阻止你。等你带着村里人赶回来时，他还保持着原来的姿势，只是石壁上多了几道指甲刮过的痕迹。被救出来后，他对你点了点头："……辛苦了。"'
          },
          {
            text: '"这里太危险了，你怎么一个人跑这么深？"',
            friendshipChange: -40,
            response: '阿石的目光暗了暗："……采矿就是我的活。"他别过脸去，不再说话。虽然你最终还是帮他搬开了石头，但气氛变得沉默。'
          }
        ]
      },
      {
        text: '你帮阿石包扎好伤口，扶着他慢慢走出矿洞。一路上他的表情还是那样面无波澜，但你注意到他走路时刻意把重心偏向你这一边，好像在无声地依靠你。'
      },
      {
        text: '走到矿洞口时，阿石停下脚步。他从怀里摸出一块石头——表面粗糙，灰扑扑的，毫不起眼。"……给你。"他说，"看着不像，但里面有玉。"他的耳根微微发红，"我……不太会说谢谢。这个代替。"'
      }
    ]
  },
  {
    id: 'a_shi_heart_5',
    npcId: 'a_shi',
    requiredFriendship: 1600,
    title: '水晶秘境',
    scenes: [
      {
        text: '一天清晨，阿石罕见地主动来找你。他站在你家门口，手里提着两盏矿灯，一言不发地看着你。等了一会儿，他才开口："……跟我来。有个地方……想给你看。"'
      },
      {
        text: '他带你进入矿洞，却没有走常规的通道，而是在一处不起眼的裂缝前停下。他侧身钻了进去，你跟在后面，弯弯曲曲地走了很久，通道越来越窄。就在你觉得快要走不动的时候，眼前忽然豁然开朗。'
      },
      {
        text: '你倒吸一口凉气——一个巨大的地下洞穴出现在面前。洞壁上密密麻麻地长满了水晶，有的晶莹剔透如冰，有的泛着淡紫色的幽光，有的呈现出温暖的琥珀色。矿灯的光照上去，整个洞穴像是一座流光溢彩的宫殿。',
        choices: [
          {
            text: '"阿石……这里太美了。谢谢你带我来。"',
            friendshipChange: 120,
            response:
              '阿石的嘴角几乎不可察觉地上扬了一下——这大概是你见过他最接近微笑的表情。"嗯。"他用矿灯照着一簇紫水晶，"……找了两年才找到这里。没告诉过别人。"'
          },
          {
            text: '"这些水晶一定值很多钱吧！"',
            friendshipChange: -40,
            response:
              '阿石的目光冷了一瞬，随即恢复了平静。"……不卖。"他简短地说。他走到一根巨大的水晶柱前，用粗糙的手指轻轻触碰它的表面，像是在抚摸一个脆弱的生命。'
          }
        ]
      },
      {
        text: '阿石在洞穴中央坐下来，把矿灯调暗。黑暗中，你惊奇地发现那些水晶竟然会自己发光——微弱的、柔和的光，像是地底的星空。"我小时候……怕黑。"阿石的声音在洞穴里回荡，"后来发现了这些会发光的石头。它们告诉我……黑暗里也有光。"'
      },
      {
        text: '他沉默了一会儿，又说："石头不会说话，不会骗人。我觉得……跟石头待在一起比跟人待在一起舒服。"他转过头看着你，矿灯的微光在他深色的眼睛里闪烁，"但是……你不一样。"他没有解释这句话的意思，站起身来，"走吧，该回去了。"'
      }
    ]
  },
  {
    id: 'a_shi_heart_8',
    npcId: 'a_shi',
    requiredFriendship: 2400,
    title: '石中心意',
    scenes: [
      {
        text: '连续好几天没有看到阿石。陈伯说他把自己关在家里，叮叮当当地不知道在敲什么。你有些担心，决定去看看。'
      },
      {
        text: '你来到阿石家门口，敲了敲门。里面的声音突然停了。过了好一会儿，门才开了一条缝，阿石探出头来，脸上沾着石粉，头发乱糟糟的，手上还缠着好几处绷带。他看到是你，眼神慌了一下，把什么东西藏到身后："你……你怎么来了。我没事。"'
      },
      {
        text: '你注意到他身后的工作台上散落着各种工具——小锤、錾子、砂纸，还有很多打磨失败的碎石。角落里放着一本翻得起毛边的《宝石雕刻图谱》。',
        choices: [
          {
            text: '"阿石，你受伤了，让我帮你包扎一下。"',
            friendshipChange: 120,
            response:
              '阿石犹豫了一下，最终别扭地伸出手。你仔细地帮他重新包扎被錾子磨破的手指。他一直侧着脸不看你，但你能感觉到他的手指在微微发抖。"……谢谢。"他的声音小得几乎听不到。'
          },
          {
            text: '"你在做什么？能让我看看吗？"',
            friendshipChange: 80,
            response:
              '阿石身体僵住了，耳朵瞬间红透了。他沉默了好久好久，久到你以为他不会回答。然后他慢慢从身后把手拿出来——掌心里躺着一样东西。"……还没做好。"他小声说。'
          }
        ]
      },
      {
        text: '阿石终于下定了决心。他深吸一口气，从怀里掏出一个小布包，笨拙地递到你面前。你打开一看——是一枚吊坠，用那座水晶洞穴里的紫水晶打磨而成，晶莹剔透，在光线下折射出温柔的紫色光芒。吊坠的形状是一朵桃花，每一片花瓣都打磨得细致入微。'
      },
      {
        text: '阿石涨红了脸，嘴唇动了半天，说出来的话断断续续的："这个……做了很久。废了好多块……手也割了好多次。因为我……我不会说漂亮的话，也不会……像别人那样。"他紧紧攥着衣角，抬起头直视你的眼睛——你第一次在他的眼中看到这样炽热的光，"但是……我想把最好的石头，做成最好的东西，给最……最重要的人。"他的声音越来越小，最后几乎是用气音说的，"……是你。一直都是你。"'
      }
    ]
  },

  // ============================================================
  // 春兰 (chun_lan) —— 茶庄女主人，温婉端庄
  // ============================================================
  {
    id: 'chun_lan_heart_3',
    npcId: 'chun_lan',
    requiredFriendship: 800,
    title: '春茶初摘',
    scenes: [
      {
        text: '清晨薄雾未散，春兰邀你去她的茶园。层层叠叠的茶垄在晨光中碧绿如洗，露珠挂在嫩芽上闪闪发光。'
      },
      {text: '"This is the first batch of spring tea this year, and it is the most precious." Chunlan said softly, picking up a young leaf with her slender fingers, "When picking tea, we pay attention to one bud and one leaf, and the movements should be gentle, as if stroking a baby's face."',
        choices: [
          {
            text: 'Imitate her technique carefully and pick the tea carefully. ',
            friendshipChange: 120,
            response: 'Chunlan looked at the tea leaves you picked, and her eyes showed approval: "The technique is very steady, and the leaves are intact. You are very talented." A gentle smile appeared at the corner of her mouth. '
          },
          {
            text: '"These teas all look the same, how can you tell the difference between good and bad?"',
            friendshipChange: 40,
            response: 'Chunlan patiently picked up two leaves and compared them to you: "Look, this leaf has a uniform color and distinct veins. It is top quality. Tea is like a person, you need to distinguish it carefully."'
          },
          {
            text: '"Picking tea is too slow, it's not as practical as growing food."',
            friendshipChange: -40,
            response: 'Chunlan's smile faltered slightly, then returned to her dignified appearance: "Everyone has his or her own reasons. It's just a tea garden passed down from our ancestors, and I can't bear to let it go to waste."'
          }
        ]
      },
      {
        text: 'After picking the tea, Chunlan will take you back to the tea house and fry the new tea by yourself. Tea leaves are flying in the iron pot, filling the room with fragrance. Her movements were skillful and graceful, as if she were performing a silent dance. '
      },
      {
        text: 'Chunlan divided the first tea into two cups, placed one cup on the empty seat by the window, and handed the other cup to you. "This cup is reserved for my father. His legs and feet are inconvenient. I will carry it over later." She smiled, "The other cup is for the person who helped today - the tea house's rules. Only those who have contributed will be rewarded."'
      }
    ]
  },
  {
    id: 'chun_lan_heart_5',
    npcId: 'chun_lan',
    requiredFriendship: 1600,
    title: 'Tea House in the Rain',
    scenes: [
      {
        text: 'A sudden heavy rain trapped you in Chunlan's teahouse. The rain was hitting the tiles heavily, and the tea house was filled with the bitter smell of agarwood and tea leaves. '
      },
      {
        text: 'Chunlan sat in front of the window, holding a letter in her hand, her brows never loosening. After a long time, she said softly: "My father replied to the letter from the state capital. He wants to sell the tea house."'
      },
      {
        text: '"He had a cold in his legs last year and couldn't go up the mountain, so he moved to live with my uncle." She flattened the letter and folded it, "He said that it is tiring for a girl to guard twenty acres of tea mountains, and it will also be troublesome to get married in the future. But this is the tea garden of five generations of our family - I have followed him up the mountain to recognize the buds since I was eight years old. How can I just say it?"',
        choices: [
          {
            text: '"Then let him see it with his own eyes. Make this year's tea and send a jar to it."',
            friendshipChange: 120,
            response:
              Chunlan was startled for a moment, and then her eyes lit up: "Yes...it's better to let him have a taste of it than to say a thousand words." She immediately got up and went to look through the ledger, "I have to select the best batch of Mingqian tea this year - you have to help me check it."
          },
          {
            text: 'I silently bought her a cup of tea and stayed with her quietly. ',
            friendshipChange: 120,
            response:
              'Chunlan looked down at the stretched leaves in the cup, was silent for a long time, and then said softly: "Your method of adding tea... is as steady as my father." She finally smiled, "If someone is sitting here and listening, my heart will not be so blocked."'
          }
        ]
      },
      {
        text: 'The rain is getting lighter. Chunlan took out an old can of tea from the depths of the cabinet - the body of the can was mottled and the word "spring" was engraved on it. "This is the last batch that my father made before he moved away. I have never been willing to open it." She carefully opened the can and brewed it. The tea had a mellow and long aroma. '
      },
      {
        text: '"In the past, rainy days were the most difficult to bear. Sitting here alone, my mind was filled with accounts and worries." Chunlan picked up the tea cup and bowed to the clear sky after the rain. "Today, I have someone to talk with, and I feel that the sound of rain is better. When the tea is sent out, I will treat you to a drink and write back."'
      }
    ]
  },
  {
    id: 'chun_lan_heart_8',
    npcId: 'chun_lan',
    requiredFriendship: 2400,
    title: 'Taking tea under the moon',
    scenes: [
      {
        text: 'On the night of early autumn, you received an invitation from Chunlan. It was written in elegant small regular script: "Tonight the moon is bright, the teahouse has prepared a pot of fragrant tea, waiting for you."'
      },
      {
        text: 'In the small courtyard of the tea house, a plain tea mat is spread on the stone table, and an oil lamp reflects a few sweet-scented osmanthus flowers. Chunlan was dressed in a moon-white dress, kneeling next to the tea banquet, with a complete set of tea sets in front of her. The moonlight shone on her body, and her whole figure looked like an ink painting. '
      },
      {
        text: '"Please sit down." Her movements were smooth and flowing, washing cups, warming pots, filling water, and making soup. Every step was elegant and calm. She handed a cup of tea to you with both hands, her eyes as gentle as moonlight. ',
        choices: [
          {
            text: 'Take the tea cup with both hands and taste it carefully. "This is the best tea I've ever had."',
            friendshipChange: 120,
            response: 'Chunlan's cheeks turned slightly red, and she couldn't hide the smile at the corner of her mouth: "Because... the person who makes the tea puts all his heart into it."'
          },
          {
            text: '"Chunlan, everything is beautiful tonight. The moonlight, the osmanthus... and you."',
            friendshipChange: 160,
            response:
              Chunlan's fingers trembled and the tea cup almost slipped. She lowered her head deeply, but you saw her ears were red. "You... you... why do you suddenly say such things." The voice was soft and soft. '
          }
        ]
      },
      {
        text: 'After tasting three courses of tea, Chunlan put down the tea cup and folded her hands on her knees. She took a deep breath and raised her head. The moonlight seemed to fill her eyes with water. '
      },
      {text: '"Our tea house has a tradition - to fry tea that is only fried once in a lifetime, called "love tea", and is only given to the most important people in this life. "She took out a small tips bag from her sleeve, "I made this by myself using the best spring tea this year. From picking to frying, I'm thinking of you every step of the way. "She finally looked directly into your eyes, her eyes clear and firm, "I know I'm not good at words, but the feelings in this cup of tea...can you understand? "'
      }
    ]
  },

  // ============================================================
  // Xue Qin (xue_qin)——painter, aloof and aloof
  // ============================================================
  {
    id: 'xue_qin_heart_3',
    npcId: 'xue_qin',
    requiredFriendship: 800,
    title: 'The Man in the Painting',
    scenes: [
      {
        text: 'You passed by Xue Qin's studio and found the door ajar. Through the crack in the door, you see her standing in front of a huge canvas, holding a paintbrush and concentrating. '
      },
      {
        text: 'She seemed to feel your presence and said without looking back: "Since you are here, come in." Don't make a sound. "You walk in and see an unfinished landscape on the canvas - mist-shrouded mountain peaks, waterfalls pouring down from the mountains, and the artistic conception is ethereal.'
      },
      {
        text: 'She suddenly put down her brush and looked at you with a frown. "Stand over there, by the window. "She pointed to the spot by the window. You did so. She picked up the brush again, her eyes moving back and forth between you and the canvas.',
        choices: [
          {
            text: 'Stand quietly, keep your posture still, and cooperate with her painting. ',
            friendshipChange: 120,
            response:
              'I don't know how long it took, but Xue Qin finally put down the paintbrush. She took a few steps back and looked at the canvas, with the corners of her mouth slightly raised - this was the first time you saw her look satisfied. "Hmm... the light and shadow are nice. You can move. "'
          },
          {
            text: '"Are you drawing me? "Go over and take a look curiously.',
            friendshipChange: 40,
            response: 'Xueqin blocked the picture with a drawing board and frowned: "Don't look at it until you finish drawing." You have no patience at all. "Although she was complaining, there was no real displeasure in her eyes.'
          }
        ]
      },
      {
        text: 'Later you heard from Uncle Chen that in the landscape painting Xue Qin painted that day, there was a figure leaning against the window and looking into the distance beside the waterfall. It is said that it was her only painting with figures in the past three years. '
      }
    ]
  },
  {
    id: 'xue_qin_heart_5',
    npcId: 'xue_qin',
    requiredFriendship: 1600,
    title: 'The Appointment of Mo Mei',
    scenes: [
      {
        text: 'The first snow of winter. You find Xue Qin sitting alone under a plum tree in the back mountain, with an easel in front of her, her fingers red from the cold, but she is still painting red plums in the snow with concentration. '
      },
      {
        text: '"Don't come over. "She noticed your footsteps and said in a cold tone, "You will destroy this snow scene. "But you noticed her lips were turning blue from the cold.'
      },
      {
        text: 'You walked around in a big circle, walked to her from another path, and handed her the hot tea you brought. Xue Qin glanced at you, as if she wanted to say something, and finally took the tea cup and took a sip. "…mind your own business. "She muttered quietly.',
        choices: [
          {
            text: 'Take off your coat and put it on her shoulders, then sit quietly and watch her draw. ',
            friendshipChange: 160,
            response:
              'Xue Qin's pen paused. She didn't refuse your coat, she just turned her face slightly. You vaguely saw the corners of her mouth curve. After a long time, she said softly: "...Aren't you cold?" fool. "'
          },
          {
            text: '"This painting is so beautiful. Your painting skills are getting better and better. "',
            friendshipChange: 80,
            response: 'Xueqin glanced at you: "My painting skills have always been very good. "After a pause, he added, "...but the plum blossoms are indeed blooming well today. Suitable for painting. "'
          }
        ]
      },
      {
        text: 'After you went back that day, you found a scroll lying at the door of your home. When you opened it, it was a picture of plum blossoms, with a touch of warmth in the cold brushwork. There is a line of small words written in the corner of the painting: "The cold plum blossoms do not compete for spring, they bloom only for close friends." ——Gift. "It's not signed, but you can recognize the handwriting.'
      }
    ]
  },
  {
    id: 'xue_qin_heart_8',
    npcId: 'xue_qin',
    requiredFriendship: 2400,
    title: 'Drawing confidant',
    scenes: [
      {
        text: 'Xueqin's studio is rarely closed. You knocked, and her voice came from inside: "...Is it you?" Come in. Don't let others see it. "'
      },
      {
        text: 'When you open the door, you are stunned - the four walls of the studio are covered with paintings, all of which are scenery of Taoyuan Township. The peach blossom stream in spring, the lotus pond in summer, the golden rice fields in autumn, and the snow-capped mountains in winter. In each painting, there is a vague figure working in the fields. '
      },
      {
        text: 'Xue Qin stands in the middle of the studio, with her back to you. Her voice was much softer than usual: "You saw it. These paintings...each one was painted secretly by me outside the window. "She turned around slowly, her eyes slightly red, "I never understood why the colors in my paintings suddenly became warmer after arriving in this small village. "',
        choices: [
          {
            text: '"Xue Qin...it turns out you have been drawing these. "',
            friendshipChange: 120,
            response:
              Xue Qin turned away, her voice trembling: "Don't look at me with that look." I just... think those scenery are beautiful, that's all. "But the fingers on her sleeve betrayed her nervousness.'
          },
          {
            text: 'Walk up to her and look into her eyes seriously. ',
            friendshipChange: 120,response: 'Xueqin's breathing quickened for a moment. She wanted to retreat, but found that there was a wall behind her. "W-what are you doing..." Cracks finally appeared in her cold mask. '
          }
        ]
      },
      {
        text: 'Xue Qin took a deep breath and took out a small painting from her arms - only the size of a palm. On the picture, a plum blossom and a peach blossom are entangled together, and the petals blend together, making it difficult to distinguish each other. '
      },
      {
        text: '"I don't know sweet words, and I don't like liveliness. Others say I am cold and withdrawn." Her voice became lower and lower, and finally seemed to be squeezed out from between her teeth, "But... you are different. You make my world colorful." She thrust the small painting into your hand and turned around quickly, "Take it away. Don't give it back. This is my... last pride." Her shoulders were shaking slightly. '
      }
    ]
  },

  // ============================================================
  // Su Su (su_su)——tailor, quiet and skillful
  // ============================================================
  {
    id: 'su_su_heart_3',
    npcId: 'su_su',
    requiredFriendship: 800,
    title: 'Worry of disconnection',
    scenes: [
      {
        text: 'You passed by the Su Tai workshop and heard a gentle sigh coming from inside. Pushing the door open, I saw Susu sitting in front of the loom in a daze, with a pile of colorful threads in her hand. '
      },
      {
        text: '"Ah, you're here." Su Su sighed with some embarrassment, "It's nothing, it's just...the quality of this batch of silk threads is not good. I want to embroider a very important piece of clothing, but the threads always break."'
      },
      {
        text: 'You notice that there are several tiny band-aids on her fingers - all from needle pricks. What she is embroidering is an exquisite wedding dress, and the phoenix pattern is half completed, which is lifelike. ',
        choices: [
          {
            text: '"This wedding dress is so beautiful. Your craftsmanship is really superb."',
            friendshipChange: 120,
            response:
              Susu's face turned slightly red: "Thank you. This is made for a bride from the next village. Every wedding dress carries the bride's expectations, and I don't want to give in." She lowered her head and continued to embroider, with a smile on her lips. '
          },
          {
            text: '"My hands are all tied up like this, do you want to take a rest?"',
            friendshipChange: 80,
            response: 'Susu shook her head: "It doesn't matter, there is no way to be a tailor without pricking your hands." She blew on her fingertips gently, "As long as the finished product looks good, these minor injuries are nothing."'
          }
        ]
      },
      {
        text: 'Before leaving, Susu stopped you: "Wait a minute." She took out a handkerchief from the side and handed it to you - the plain white silk was embroidered with a small bamboo plant with fine stitches. "Yours is old, let's use it instead." She paused and added, "I would like to thank you for always coming to the shop to sit and talk with me - I am stepping on the loom alone, and the sound of the machine is all in my ears, which is very boring."'
      }
    ]
  },
  {
    id: 'su_su_heart_5',
    npcId: 'su_su',
    requiredFriendship: 1600,
    title: 'Old clothes, new clothes',
    scenes: [
      {
        text: 'Susu took the rare opportunity to leave the tailoring workshop and stand in front of your farm. She was holding a cloth bag in her arms. When she saw you approaching, she spoke nervously: "Um... I have a gracious favor."'
      },
      {
        text: 'She opened the cloth bag and found an old faded piece of clothing. "This is my mother's wedding dress. She sent a letter a few days ago saying that the silk and satin shop in the city is short of a manager and asked me to go." Susu bit her lip, "She also said that she changed the dress and put it on to give me courage. But... I don't want to go. I want to guard this shop."',
        choices: [
          {
            text: '"Then change it to look like yourself and wear it back to see her."',
            friendshipChange: 120,
            response:
              Susu was stunned for a long time, and suddenly nodded vigorously: "Yes...I will change it myself. Change it to what I want, and let her see my craftsmanship over the past few years." She took a deep breath, "Can you accompany me? I don't dare to cut alone."'
          },
          {
            text: '"If your mother wants you to live a good life, you don't have to follow her own path."',
            friendshipChange: 120,
            response:
              Susu's eyes turned red, and she hurriedly lowered her head and wiped them: "I thought so too, but I couldn't get the words out of my mouth." She whispered, "My mother's hands are much better than mine... I'm always afraid that she thinks I'm not promising."'
          }
        ]
      },
      {
        text: 'After a whole day of work, the old fabric was finally removed and rewoven into a new scarf. Susu held the scarf in the palm of her hand, put it gently on her face, and closed her eyes. "If Mom saw it... she would probably say that the stitches are okay." She murmured softly. '
      },
      {
        text: 'She opened her eyes, folded the scarf and put it into the cloth bag. "I will go back to my parents' house next month and give this to her, so I can explain it clearly." She looked at you and solemnly raised her hand, "Thank you for staying with me today. When I come back, I will make you a thick winter coat - I will pay for it, I won't do it in vain."'
      }
    ]
  },
  {
    id: 'su_su_heart_8',
    npcId: 'su_su',
    requiredFriendship: 2400,
    title: 'Icing on the cake',
    scenes: [
      {
        text: 'One day you come home and find an exquisite wooden box at the door with a red rope tied to it. When he opened it, he found a piece of clothing inside - made of fine silk, with a color as warm as jade, and the collar and cuffs were embroidered with fine patterns. There is another letter. '
      },
      {
        text: 'The letter reads: "I have been making this dress for a long time and have measured your size many times (all secretly when you weren't paying attention, I'm sorry). If... it's convenient for you tonight, please wear it and come to Su Su's tailoring workshop. - Su Su"'
      },
      {
        text: 'You put on new clothes and come to the tailoring workshop. Susu is standing at the door waiting for you. She is also wearing a new plain white dress. When she sees you wearing the clothes she made, her eyes light up. "It fits very well." She said softly, "It looks better than I imagined."',
        choices: [
          {text: '"This is the best gift I have ever received. Thank you, Susu."',
            friendshipChange: 120,
            response: 'Susu lowered her head, twisted the corners of her clothes with her hands, and said in a voice as thin as a gnat: "Don't thank me... this piece of clothing... is the work I put the most effort into. Because..." Her voice was broken. '
          },
          {
            text: 'Reached out his hand to straighten her hair that was messed up by the wind. ',
            friendshipChange: 160,
            response: 'Susu trembled all over and looked at you blankly, her cheeks quickly turning red to her ears. "You..." Her voice became softer, as if she was afraid of scaring away a butterfly. '
          }
        ]
      },
      {
        text: 'Susu took out a small sachet from her sleeve - it is made of the same piece of fabric as the clothes you are wearing. She put her hands in front of you and lowered her head so much that it almost touched her chest. '
      },
      {
        text: '"I am a clumsy-tongued person who cannot speak nice words. But I can make clothes... Every stitch and every thread is what I want to say to you." She finally mustered up the courage to raise her head, her eyes were red, but her voice was surprisingly firm, "In this life, I want to keep making clothes for you. I make thin shirts in spring, cotton-padded jackets in winter, and raincoats when it rains... I don't want to stop every stitch and thread all year round."'
      }
    ]
  },

  // ============================================================
  // Hongdou (hong_dou) - winery girl, bold and generous
  // ============================================================
  {
    id: 'hong_dou_heart_3',
    npcId: 'hong_dou',
    requiredFriendship: 800,
    title: 'The aroma of wine is not afraid of deep alleys',
    scenes: [
      {
        text: 'Hongdou stopped you and stuffed a wine bottle into your hand: "Try it! This is my new peach blossom wine! The first batch! I haven't given it to anyone else yet!"'
      },
      {
        text: 'You take a sip - sweet and fragrant with peach blossoms, with a long aftertaste. Hongdou put his hands on his hips and stared at you with bright eyes: "How do you like it? It tastes good!"'
      },
      {
        text: '"To tell you the truth, it took me three months of hard work to brew this batch of wine. The peach blossoms must be picked in the early morning when there is dew, and the water must be spring water from the back mountain. The temperature cannot exceed..." She kept talking, her eyes full of enthusiasm and pride. ',
        choices: [
          {
            text: '"It's so delicious! Can I have another drink?"',
            friendshipChange: 120,
            response: 'Hongdou slapped her thigh: "Happy! I like you like this! Come on, sit down and drink slowly! I won't go home until you're drunk today!" She poured a full bowl for you and poured a bowl for herself, "Fuck!"'
          },
          {
            text: '"The taste is good, but the aftertaste is a bit astringent. Can the fermentation time be longer?"',
            friendshipChange: 80,
            response:
              Hongdou was stunned for a moment, and then showed an expression of admiration: "Hey, you really know your stuff? That makes sense! I didn't expect that you not only know how to farm, but also know how to make wine!" Her eyes shone with admiration, "Come to my winery and be a sommelier in the future!"'
          }
        ]
      },
      {
        text: 'After several bowls of wine, Anko's cheeks turned slightly red. She leaned against the wine vat and said with a smile: "My father used to say, Hongdou, you have such a wild temper that no one will be able to stand it in the future. If I say I can't stand it, I can't stand it. I have my own winery!" She shook the bowl, "As a result, he is tending his potted flowers in the backyard every day, but I am soaking in the wine vat every day." She glanced at you and said, "-Not many people can drink together. We will come more often in the future."
      }
    ]
  },
  {
    id: 'hong_dou_heart_5',
    npcId: 'hong_dou',
    requiredFriendship: 1600,
    title: 'The Secret of the Wine Jar',
    scenes: [
      {
        text: 'You found Hongdou squatting in front of a row of huge wine jars in the backyard of the winery. He was not as cheerful as usual, sitting alone and depressed. There was a broken wine jar on the ground, and the wine flowed all over the floor. '
      },
      {
        text: '"Stop looking." Hongdou said without raising her head, "I broke a jar of ten-year-old wine. There were three jars in total when my father established the jar, but now there are only two jars left." There was a hoarseness in her voice that she didn't usually have. '
      },
      {
        text: '"My father is a person who has been injured by alcohol." Hongdou suddenly said, "He has been making good wine all his life, and he has been drinking for half his life. He gave up drinking five years ago after he coughed up blood. The day we moved to the backyard to plant flowers, he told me - Hongdou, wine is a good thing, but you have to know when to put the cup down." She raised her head, her eyes red, "I still haven't learned how. When this jar broke, I always feel like he was beating me."',
        choices: [
          {
            text: 'Sit down next to her and help her pick up the pieces piece by piece. ',
            friendshipChange: 120,
            response:
              Hongdou watched your movements and was silent for a long time, then he squatted down and picked them up together. "...Thank you." She whispered, "I usually laugh and joke, but when something really happens, I don't know what to say."'
          },
          {
            text: '"Then go and ask him. He is still here, if you want to know anything just ask."',
            friendshipChange: 160,
            response:
              Hongdou suddenly raised her head, paused for several breaths, and then wiped her face vigorously: "...That's right. Why should I fight with the broken jars here." She stood up and patted the dirt on her pants, "I will go to the backyard to find him tomorrow and ask when the remaining two jars should be opened."'
          }
        ]
      },
      {
        text: 'Hongdou took a deep breath and returned to his usual crisp energy. "Okay! Don't be sad anymore! My dad will definitely laugh at me if he sees me like this." She grinned, although there were still tears in the corners of her eyes, "Let's go and open another jar and taste it. My dad will be happy to know that I gave the wine to real people."'
      }
    ]
  },
  {
    id: 'hong_dou_heart_8',
    npcId: 'hong_dou',
    requiredFriendship: 2400,
    title: 'Drunk Mantra',
    scenes: [
      {text: 'On the night of the Mid-Autumn Festival, Hongdou pulled you up to the hill behind the village. She carried a jar of wine and two bowls. The moon is big and round, hanging in the dark sky, and below are the lights of thousands of houses in Taoyuan Township. '
      },
      {
        text: '"Come! Watch the moon and drink!" Hongdou patted the wine jar away and filled a bowl for you. She poured herself a bowl and drank it to her heart's content. Under the moonlight, her profile was a little less heroic than usual and a little more soft. '
      },
      {
        text: 'After a few bowls of wine, Hongdou started talking more. She sat cross-legged and looked up at the bright moon: "You think... would anyone like a woman like me? She has a loud voice, loves to drink, and is not gentle enough..." She showed a rare expression of lack of confidence. ',
        choices: [
          {
            text: '"You are the most genuine and charming person I have ever met."',
            friendshipChange: 120,
            response: 'Hongdou was stunned for a moment, then burst out laughing and punched you on the shoulder: "You kid...you started talking nonsense after drinking a few bowls." But her eyes were brighter than the moonlight. '
          },
          {
            text: 'Silently poured his own wine into her bowl. "I will accompany you as much as you want to drink tonight."',
            friendshipChange: 120,
            response: 'Hongdou looked down at the wine in the bowl and suddenly became quiet. "You..." her voice became much softer, "you always say the right things when I need them most."'
          }
        ]
      },
      {
        text: 'It's late at night, Hongdou is leaning on your shoulder, seeming drunk but not drunk. "Let me tell you a secret." Her voice was vague but serious, "This jar of wine is called 'Acacia Brewing', and I... brewed it specifically for one person. After brewing for half a year, we selected the best peach blossoms and the best spring water. "'
      },
      {
        text: 'She turned her head and looked at you in the moonlight, her eyes so clear that she didn't look like someone who had drunk so much wine: "That person is you." I knew it from the first time I drank with you - you are the only person in my life who can make me willing to share half of the best wine. "She handed the bowl to you, "If you drink from this bowl, you will be... mine. Just kidding. ' she said with a smile, but her hands were shaking.'
      }
    ]
  },

  // ============================================================
  // Danqing (dan_qing) - scholar, elegant and gentle
  // ============================================================
  {
    id: 'dan_qing_heart_3',
    npcId: 'dan_qing',
    requiredFriendship: 800,
    title: 'Bamboo Forest Discussion',
    scenes: [
      {
        text: 'In the bamboo forest behind the village, you met Danqing by chance. He was leaning on a green bamboo, holding a book in his hand and reading something softly. '
      },
      {
        text: '"Oh? "When he saw you, he smiled gently, "This bamboo forest is my favorite place to read. The bamboo joints are modest and the bamboo leaves are honest - this is the character that scholars should imitate. "'
      },
      {
        text: 'He closes the book and invites you to sit down. "Before you came to Taoyuan Township, you lived in the city, right? Why are you willing to give up the prosperity of the city and come to farm in this countryside? "',
        choices: [
          {
            text: '"Instead of doing nothing in the city, it is better to do something practical in the countryside. "',
            friendshipChange: 120,
            response:
              Danqing's eyes lit up: "What a down-to-earth person!" "How can you sweep the world if you don't sweep one house?" Your down-to-earth nature is stronger than that of many scholars. "He bowed to you.'
          },
          {
            text: '"I can't say why, I just think it's good here. "',
            friendshipChange: 40,
            response: Danqing smiled and said, "Sometimes, you can make the best choice without a reason." As the saying goes, "Tao follows nature." "His eyes look at you tenderly.'
          }
        ]
      },
      {
        text: 'At dusk, Danqing got up and sorted out the books. He suddenly said: "I have studied downstream for many years and have been to many places. Academies elsewhere teach how to take exams and become an official. Only here, the old farmers at the entrance of the village can talk to me about solar terms. "He smiled, "It's a pleasure to meet someone you can chat with. I will show you my newly written manuscript another day - you will speak frankly and will not flatter me. "'
      }
    ]
  },
  {
    id: 'dan_qing_heart_5',
    npcId: 'dan_qing',
    requiredFriendship: 1600,
    title: 'Scholar's Ambition',
    scenes: [
      {
        text: 'You passed by the hut where Danqing stayed and heard the sound of tearing paper coming from inside. When I pushed the door open and went in, I saw crumpled paper balls all over the floor. Danqing sat in front of the case, writing and scratching on the paper in front of him. '
      },
      {
        text: '"Can't write. "When he saw you, he smiled bitterly and shook his head, "I have been writing a book about the history of Taoyuan Township, and I want to leave the stories here to future generations. But...after three years of writing, I still feel like something is missing. "'
      },
      {
        text: 'He picked up a stack of manuscripts and showed them to you. The handwriting is neat and beautiful, recording the geography, products and humanities of Taoyuan Township. It is indeed well written - but as he said, it always feels like it lacks a certain vitality and warmth. ',
        choices: [
          {
            text: '"Maybe what you lack is not literary talent, but life. You should go to the fields more often and listen to the villagers telling their stories. "',
            friendshipChange: 120,
            response:
              Danqing was stunned, and then slammed the table: "One word woke up the dreamer!" I have been shutting myself in the house, how can I write living words! "He grabbed a pen and paper and looked at you with enthusiasm, "Will you take me to your farm? Start in the fields! "'
          },
          {
            text: '"Take your time, good articles don't need to be rushed. "',
            friendshipChange: 80,
            response:
              Danqing sighed, but nodded: "You're right." "Articles are timeless, and you know the gains and losses." Maybe I was too impatient. "He smiled slightly, "After talking to you, I feel a lot more at ease. "'
          }
        ]
      },
      {text: 'A few days later, Danqing came to you excitedly with the newly written chapter. "Look at this paragraph - it's about Uncle Chen's Wanwu Shop, which has been there since his grandfather's generation. There is also Fat Aunt's tofu shop, which uses century-old brine." His words really came to life, full of fireworks. He closed the manuscript and solemnly handed it over to you: "Thank you for your enlightenment in this chapter. I wrote down your name in the preface - as a friend, don't refuse."
      }
    ]
  },
  {
    id: 'dan_qing_heart_8',
    npcId: 'dan_qing',
    requiredFriendship: 2400,
    title: 'Oath by pen',
    scenes: [
      {
        text: 'Danqing invites you to gather in the bamboo forest on the night of the Mid-Autumn Festival. Under the moonlight, with bamboo shadows dancing, he spread rice paper on the stone table and ground ink. '
      },
      {
        text: '"The book is finished." He said calmly, placing a stack of neatly bound manuscripts in front of you. The words "Taoyuan Zhi" are written on the cover, and the title page reads: "Dedicated to the person who helped me find my hometown." '
      },
      {
        text: '"Studying for ten years, I have been looking for a place worth writing about and a person worth staying for." He picked up the pen and wrote under the moonlight, with steady and powerful strokes. You look closer - it's your name written on it. ',
        choices: [
          {
            text: '"Danqing, your book will definitely be passed down to future generations."',
            friendshipChange: 80,
            response: 'Danqing put down the pen and shook his head: "I don't care whether the book can be passed down to the world. What I care about is that you have been by my side while writing this book."'
          },
          {
            text: 'Pick up another pen and write your name next to his name. ',
            friendshipChange: 160,
            response:
              Danqing looked at the two names side by side on the paper, his lips trembled slightly and his eyes were red. "You..." His voice choked, and it took him a long time to find it again, "Do you know what this meant in ancient times?"'
          }
        ]
      },
      {
        text: 'Danqing stood up, the moonlight illuminated his handsome face. He bowed deeply to you - this is not an ordinary courtesy, but the most solemn intention of the ancients. '
      },
      {
        text: '"I am Danqing, a poor scholar with no money or silver. I only have a heart full of poems and books and a sincere heart." He straightened up, his eyes as clear as the moon, his voice gentle but firm, "I would like to swear by my pen and my ink as an alliance - from now on, I want to spend every article, every poem, every sunrise and sunset with you."'
      }
    ]
  },

  // ============================================================
  // A tie (a_tie) - blacksmith apprentice, honest and honest
  // ============================================================
  {
    id: 'a_tie_heart_3',
    npcId: 'a_tie',
    requiredFriendship: 800,
    title: 'Iron Flower Blooms',
    scenes: [
      {
        text: 'When you came to the blacksmith shop, Blacksmith Sun was not there, and Atie was the only one working on the blacksmith. He was sweating profusely, and the hammer in his hand was clanking, but if you look closely, the iron plate he was knocking on was crooked. '
      },
      {
        text: '"Ah! No, no, no! It's crooked again!" Atie scratched his head and scratched his head anxiously, and threw the iron plate back into the stove. Only then did he notice you and blush: "You, you saw it... I was practicing hitting the hoe, but I couldn't hit it straight. Master said my strength was uneven..."'
      },
      {
        text: 'He sat by the anvil in frustration, rubbing his big palms together. "Master's craftsmanship is so good. I've been studying for three years and it's still the same. Sometimes I wonder... maybe I'm too stupid."',
        choices: [
          {
            text: '"Here, let me hold you up and try again."',
            friendshipChange: 120,
            response:
              Ah Tie's eyes lit up: "Really, really?" With your help in fixing the iron plate, he finally made a decent hoe. He raised the hoe and looked at it again and again, as happy as a child: "It's straight! It's really straight! It's all your credit!"'
          },
          {
            text: '"It doesn't matter whether you are stupid or not, persistence is important. You are already much better than you were three years ago."',
            friendshipChange: 80,
            response: 'Ah Tie was stunned for a moment, then scratched the back of his head and smiled naively: "You, you really think so? Hehe... Master never praises me, you are the first person to say so."'
          }
        ]
      },
      {
        text: 'After work is over, Ah Tie secretly slips you a small iron ring. The workmanship is rough, but you can tell he put a lot of thought into it. "This, this is what I made when I was practicing...it's not worth anything. But, but...it's for you." He ran away with a red face, almost hitting the door frame. '
      }
    ]
  },
  {
    id: 'a_tie_heart_5',
    npcId: 'a_tie',
    requiredFriendship: 1600,
    title: 'Heart of Fire',
    scenes: [
      {
        text: 'Late at night, you were awakened by a banging sound. Following the sound, I walked to the blacksmith shop and found Atie alone by the fire, covered in sweat and charcoal, hammering a piece of iron. '
      },
      {
        text: 'He was startled when he saw you: "You, why are you here! It's so late!" He wanted to hide the thing in his hand, but it was too late - you saw that what he was making was an exquisite iron flower, with petals layered on top of each other and already beginning to take shape. '
      },
      {
        text: '"Master said I can only do rough work and cannot make fine objects." Atie lowered his head, "But I want to prove that I can do it. I practice secretly every night after Master leaves." He spread out his palms - full of traces of burns and calluses. ',
        choices: [
          {
            text: 'Took his hand and looked at the burn scars. "These are not stupid, they come from practice."',
            friendshipChange: 160,
            response:
              Ah Tie retracted his hand, then slowly spread it out, staring blankly at his palm for a long time. "...My master also said this once, just once." He sniffed, "I thought I remembered it wrong."'
          },
          {text: '"Come on, Atie. I believe you can make the best ironware."',
            friendshipChange: 80,
            response: 'Atie nodded vigorously, his big eyes reflecting the beating fire. "Well! I, I will definitely work hard! If someone believes in me, I am not afraid of anything!"'
          }
        ]
      },
      {
        text: 'A month later, Atie finally completed the iron flower. He put it in the sun - the iron petals were as thin as cicada wings, reflecting a rainbow-like luster in the light. Even Blacksmith Sun was so surprised that he couldn't speak. "This... was done by you, Ah Tie?" Ah Tie nodded vigorously with a red face, then ran to you quickly and pushed the iron flower into your hand: "Here, here you go! If you hadn't come that day, I might have smashed it. Don't think it's ugly!"'
      }
    ]
  },
  {
    id: 'a_tie_heart_8',
    npcId: 'a_tie',
    requiredFriendship: 2400,
    title: 'A hundred times tempered into steel',
    scenes: [
      {
        text: 'Tiejiang Sun found you, with a rare expression of seriousness and relief. "That kid Atie... I don't know what kind of medicine he took, but he has made rapid progress recently. He said he wanted to do a "masterpiece", so he locked himself in the shop for three days, and no one was allowed in. "He sighed, "But...he said he would let you go. "'
      },
      {
        text: 'You come to the blacksmith shop. Ah Tie stood next to the anvil, his whole body slimmed down, but his eyes were astonishingly bright. There is a sword on the shelf behind him - no, not just a sword, the sword is engraved with fine patterns, and the hilt is wrapped with wrought iron peach blossoms. This is a handicraft-level sword. '
      },
      {
        text: '"I, I made it. "Atie's voice was hoarse but full of pride. He handed the sword to you, his hands shaking a little." The master said... The blacksmith only makes one "centering work" in his life, and uses up all his life's learning to dedicate it to the most important person. "',
        choices: [
          {
            text: 'Take the sword solemnly and look at it carefully. "Ah Tie, this sword... is so beautiful. "',
            friendshipChange: 120,
            response:
              Ah Tie rubbed his hands vigorously and grinned, his smile was honest and pure: "You, you really like it?" Then I'll be relieved! In order to fight this sword, I burned my fingers until they were bald, hehe, but it was worth it! "'
          },
          {
            text: '"Atie, you are no longer the apprentice who can't hit a hoe straight. "',
            friendshipChange: 120,
            response: 'A Tie's eyes suddenly turned red. He rubbed his eyes vigorously: "I, I didn't cry! It's smoky! " He sniffed vigorously, "I am what I am now... all because of you. "'
          }
        ]
      },
      {
        text: 'Atie took a deep breath and straightened his back. He used to always stoop and shrink his shoulders, as if he was afraid of taking up too much space. But now he stood up straight, his eyes frank and intense. '
      },
      {
        text: '"I, I can't speak literate words, nor can I write poetry like Danqing. "His big hands clutched the apron tightly, his knuckles turned white, "But I can... I can use these hands to make the best tools in the world for you, build the strongest house, and make the most beautiful ironwork. I will fight you in this life, the next life, and the next life! His face was so red that it could make iron, "So...so you are willing to...let me stay by your side all the time?" "'
      }
    ]
  },

  // ============================================================
  // Yunfei (yun_fei) - hunter, unruly
  // ============================================================
  {
    id: 'yun_fei_heart_3',
    npcId: 'yun_fei',
    requiredFriendship: 800,
    title: 'Encounter in the forest',
    scenes: [
      {
        text: 'You lost your way while collecting in the back mountain. The sky is getting dark, and there are only dense shadows of trees and the occasional sound of birds around. Just when you were anxious, a figure flashed out from the trees - it was Yunfei. '
      },
      {
        text: '"It's you again. Yunfei leaned against a pine tree and looked at you expressionlessly, "Lost?" "He turned around and left without waiting for your answer, "Follow me, don't fall behind. "'
      },
      {
        text: 'He leads you through the dense forest with brisk and precise steps, as if he knows every tree and stone here. Suddenly he stopped and motioned for you to squat down - in the open space ahead, a doe and her fawn were drinking water. The moonlight shone on them, and the scene was quiet and beautiful. ',
        choices: [
          {
            text: 'Hold your breath and watch this scene quietly. ',
            friendshipChange: 120,
            response:
              Yunfei glanced sideways at you, seeming a little surprised by your silence. After the deer herd had gone far away, he said: "...Not bad. Most people get fussed when they see a deer. "That's probably the highest praise he's ever given.'
          },
          {
            text: '"Aren't they afraid of you? "',
            friendshipChange: 40,
            response:
              Yun Fei snorted softly: "I won't hit them." I only hunt what needs to be hunted, not cubs or pregnant ones. The rule in the mountains is to take it in moderation. "Although his voice is cold, you feel a sense of awe for nature.'
          }
        ]
      },
      {
        text: 'When walking out of the woods, Yunfei suddenly stopped, took out a handful of herbs from his backpack and threw them to you. "There are snakes and insects in the mountains. Crush this into pieces and apply it on your ankles. "After he finished speaking, he strode away without looking back. But you noticed that he was standing on the hillside in the distance. He waited until you safely entered the village before turning around and leaving.'
      }
    ]
  },
  {
    id: 'yun_fei_heart_5',
    npcId: 'yun_fei',
    requiredFriendship: 1600,
    title: 'The Wound of the Lone Wolf',
    scenes: [
      {
        text: 'You found Yunfei leaning under a tree in the back mountain, with a rough cloth wrapped around his left arm, and blood oozing from the cloth. His eyes were closed and his face was pale. '
      },
      {
        text: 'He heard footsteps and opened his eyes suddenly, his hand already holding the hunting knife at his waist. When I saw it was you, I slowly let go. "...It's okay. Got hit by a wild boar. "His voice was weak but still stubborn, "Don't worry about me, it will be fine in a moment. "'
      },
      {text: 'You squat down and check his wounds - there is a gash in the flesh and there is a lot of blood. This is not something that can be solved "at once". ',
        choices: [
          {
            text: 'Ignore his objections and forcefully re-bandage his wounds. ',
            friendshipChange: 160,
            response:
              'Yunfei wanted to push your hand away, but he didn't have the strength. He turned away and clenched his teeth. After you finished bandaging, he was silent for a while, then squeezed out a few words through his teeth: "...your hands are pretty steady."'
          },
          {
            text: '"It's too dangerous for you to be alone in the mountains. Let me know when you go into the mountains next time."',
            friendshipChange: 80,
            response: 'Yunfei sneered: "I have lived in the mountains for ten years, I don't need-" Halfway through his words, a sharp pain from the wound made him groan. He finally lost his temper and said, "...It's up to you."'
          }
        ]
      },
      {
        text: 'You help him down the mountain back to his hut. The house was pitifully simple - a wooden bed, a hunting bow, and a few shabby pieces of clothing. Hanging on the wall is a faded portrait of a young woman holding a little boy. '
      },
      {
        text: 'Yunfei noticed your gaze, and his voice suddenly became very low: "That's my mother. She died of a sudden illness when I was six years old." He paused, "My father drank every day at that time, and I couldn't bear it, so he ran into the mountains and built a shack, where he lived for ten years." His expression did not waver, as if he was telling someone else's story, "He later asked someone to bring things to him several times, but I confiscated them. The mountains and forests were clean, and the birds and beasts did not make any noise."'
      },
      {
        text: 'He turned the portrait over and leaned it against the wall, with a strong tone: "...Last year he asked Uncle Chen to tell me that the yard was repaired and he asked me to go back and have a look. I didn't go." He glanced at you and quickly looked away, "If you pass by the tiled house at the east end of the village one day... forget it, it's nothing."'
      }
    ]
  },
  {
    id: 'yun_fei_heart_8',
    npcId: 'yun_fei',
    requiredFriendship: 2400,
    title: 'Appointment on the Mountain',
    scenes: [
      {
        text: 'One morning, Yunfei appeared at your door. He leaned against the doorframe, awkwardly not looking at you. "...Follow me. There is a place I want to take you to." He paused, "You are the only one."'
      },
      {
        text: 'He took you over the highest mountain in the back mountain - a place where even the hunters in the village dare not go easily. You walked through dense forests, climbed over cliffs, and finally stood on the top of the mountain. '
      },
      {
        text: 'The sight in front of you makes you forget to breathe - there is an endless sea of clouds under your feet, and the morning sun rises from the clouds, dyeing the sky golden red. The smoke from Taoyuan Township rises from the sea of ​​clouds, like a village floating in a fairyland. ',
        choices: [
          {
            text: '"Yunfei...it's so beautiful here. Thank you for bringing me here."',
            friendshipChange: 120,
            response: 'Yunfei stands next to you, the wind blowing his long hair. His eyes were cast into the distance, and his voice was much softer than usual: "This is my secret. I haven't brought anyone here for ten years."'
          },
          {
            text: 'Stand side by side with him quietly and watch the sunrise together. ',
            friendshipChange: 120,
            response: 'For a long time, neither of you spoke. But the silence is comfortable - like two people can understand each other's feelings without words. '
          }
        ]
      },
      {
        text: 'The sun has fully risen. Yunfei suddenly spoke, in a low voice, as if he was talking to the wind: "I used to think...people are unreliable. Not as good as a hound, not as good as a pine tree." He turned around and looked at you seriously - perhaps the most seriously in his life. '
      },
      {
        text: '"But you changed me." His voice was a little stiff, as if it was the first time he said such words, and every word was forced out of his heart, "You... made me want to walk out of the mountains and stay in a place with people. That person is you." His hand trembled slightly and held your hand tightly, as if he was afraid that he would never be able to hold it again if he let go. "I can't say nice things... but I can protect you with my life. This mountain is my witness."'
      }
    ]
  },

  // ============================================================
  // Da Niu (da_niu) - a ranch boy, honest and enthusiastic
  // ============================================================
  {
    id: 'da_niu_heart_3',
    npcId: 'da_niu',
    requiredFriendship: 800,
    title: 'Calf Delivery',
    scenes: [
      {
        text: 'Daniu came to you in a hurry, with a face full of anxiety: "Oh no, no, no! My old scalper is going to give birth! But I can't do it alone! Can you come and help?"'
      },
      {
        text: 'You run to the pasture with him. A big ox lay in the hay shed, panting uneasily. The big cow squatted next to it, rubbing his hands nervously while comforting it. "Don't be afraid, darling, Brother Daniu is here."'
      },
      {
        text: 'Under the guidance of Daniel, you help deliver hot water and prepare hay. More than an hour later, a wet calf was finally born. It stood up unsteadily and nuzzled your palm with its wet nose. ',
        choices: [
          {
            text: 'Carefully hold the calf and help it dry the water. ',
            friendshipChange: 120,
            response:
              'Daniu looked at your gentle movements, his eyes were red: "Look how much it likes you! Mavericks recognize people, they will kiss whoever they see the first time." He sniffed, "Thank you for coming to help!"'
          },
          {
            text: '"Daniu, you are really good at taking care of animals."',
            friendshipChange: 80,
            response: 'Daniu scratched his head in embarrassment: "Hey, I've liked it since I was a child! I think animals are more important than anything else! If they treat you well, you have to treat them better!" He smiled like a child. '
          }
        ]
      },
      {text: 'The big cow named the calf "Fubao". "Because you helped deliver the baby, it's a blessing!" He patted your shoulder so hard that he almost knocked you down. "You can come see Fu Bao anytime from now on! He is half your child!"'
      }
    ]
  },
  {
    id: 'da_niu_heart_5',
    npcId: 'da_niu',
    requiredFriendship: 1600,
    title: 'Wind and Rain Ranch',
    scenes: [
      {
        text: 'A storm is coming. You were worried about the big cow's pasture, so you rushed there in the rain - sure enough, several sections of the fence were blown down by the wind, and a few sheep ran out. Daniel ran back and forth in the rain, soaked all over, and his voice was hoarse. '
      },
      {
        text: '"Why are you here! Go back quickly!" Daniel was shocked and anxious when he saw you. But he didn't stop - he was running after a frightened sheep. '
      },
      {
        text: 'You help him herd sheep and build fences. In the wind and rain, you worked together to find the last lost sheep. When everything is settled, you sit slumped in the hut, as if you were fished out of the water. ',
        choices: [
          {
            text: '"Daniu, it's really not easy for you to support this ranch by yourself."',
            friendshipChange: 120,
            response:
              'Daniu was silent for a while, and then smiled naively, but with a hint of bitterness in the smile: "It's not easy... but it's worth it when you see them safe." He looked at you, his eyes full of emotion, "Thanks to you today. Really."'
          },
          {
            text: 'Give him half of the dry food you have left. ',
            friendshipChange: 120,
            response:
              Daniel took the dry food and felt a sore nose: "You, you are still hungry..." He took a big bite and chewed, tears mixed with rainwater flowing down his cheeks. "I'm not crying! It's rain!"'
          }
        ]
      },
      {
        text: 'The rain stopped and the sunset emerged from behind the dark clouds. The big cow stood up and looked at his pasture - although the fence was crookedly repaired, the animals were all safe. He took a deep breath and said loudly: "I don't have much ability, I'm just good to animals. I always thought that having animals is enough..." He turned to look at you, his big eyes shining, "But today I realized that having someone who is willing to accompany me in the rain is more important than anything else."
      }
    ]
  },
  {
    id: 'da_niu_heart_8',
    npcId: 'da_niu',
    requiredFriendship: 2400,
    title: 'Pastoral and melodious',
    scenes: [
      {
        text: 'Danniu invites you to the ranch and says there are "important things". When you arrive, you find that the pasture has been tidied up - Daniel is usually slovenly, but today he is actually wearing a new set of neat clothes, and his hair is combed meticulously (although there is a bunch of hair sticking out that cannot be suppressed). '
      },
      {
        text: '"You're here!" He was so nervous that he didn't know where to put his hands and feet, and his smile was so stiff that it looked like he had practiced it a hundred times. "Sit, sit over there! I'll show you something!"'
      },
      {
        text: 'He played a bamboo flute - the tune was rough but cheerful, it turned out to be a pastoral song. With the sound of the flute, the cattle, sheep, chickens and ducks in the pasture came out neatly and lined up in a row. Each animal has a small flower tied around its neck. Look carefully - those flowers form two words. ',
        choices: [
          {
            text: 'I was stunned, and then I couldn't help laughing. "Daniu, how long have you been rehearsing?"',
            friendshipChange: 120,
            response: 'Da Niu blushed: "I've been practicing for half a month! Fu Bao always disobeys and runs out of position... Hehe." He rubbed his hands, "Does it look good?"'
          },
          {
            text: 'I was so moved that I couldn't speak, so I just nodded vigorously. ',
            friendshipChange: 120,
            response: 'Daniu's eyes suddenly lit up: "You, you like it?! That's great! I was afraid you would think I was stupid..." He jumped twice with joy, making the chicken next to him start to flutter. '
          }
        ]
      },
      {
        text: 'The two words composed of flowers on those animals are "like". '
      },
      {
        text: 'Daniu stood in front of you innocently, rubbing his big hands again and again, his face so red that he could boil an egg. "I, I can't write poetry, nor can I say beautiful words. But I know one thing -" He raised his head suddenly and shouted loudly, so loudly that the birds in the tree flew away, "I like you!! I like you very much!! I like you more than cows!!" After he finished shouting, he was stunned at first, and then became even redder, "...I'm too loud, right?" Fu Bao next to him said "moo", as if to cheer him up. '
      }
    ]
  },

  // ============================================================
  // Mo Bai (mo_bai) - musician, quiet and melancholy
  // ============================================================
  {
    id: 'mo_bai_heart_3',
    npcId: 'mo_bai',
    requiredFriendship: 800,
    title: 'The Sound of Broken Strings',
    scenes: [
      {
        text: 'You are attracted by a burst of music and follow the sound to the small bridge in the west of the village. Mo Bai was sitting on the bridge, holding the guqin in his arms, his fingertips slowly sliding over the strings. Under the moonlight, the sound of the piano is like crying, as if telling a story that no one is listening to. '
      },
      {
        text: 'Suddenly, there was a "bang" sound - the strings were broken. Mo Bai stopped, looked at the broken strings, and was silent for a long time. When you approached, he didn't raise his head: "...How long have you been listening?"'
      },
      {
        text: '"This piano was left to me by my master before he left. Before he left, he said something: When the string is broken, the piano is telling you that you should let go of some things." His voice was very soft, as if he was talking to himself. ',
        choices: [
          {
            text: '"What are you putting down?" asked softly. ',
            friendshipChange: 120,
            response:
              Mo Bai was silent for a long time. Under the moonlight, his profile looked like an ink painting. "Let go of the past." He finally said, "I left the last place because... no one wanted to listen to my piano anymore. They said my music was too sad."'
          },
          {
            text: '安静地坐在他旁边，什么都不说。',
            friendshipChange: 80,
            response:
              '墨白抬起头看了你一眼，似乎对你的沉默感到意外。"……你是第一个不问为什么的人。"过了一会儿，他又开口，"以前我觉得不被理解是理所当然的。但你坐在这里……我感觉好像不那么孤独了。"'
          }
        ]
      },
      {
        text: '他从怀中取出一根新弦，仔细地换上。重新调好音后，他弹了一曲——和之前不同，这首曲子虽然带着淡淡的忧伤，但结尾处多了一丝温暖。"这首曲子叫《遇》。"他说，"今天刚写的。"他没有再解释，但你知道是什么意思。'
      }
    ]
  },
  {
    id: 'mo_bai_heart_5',
    npcId: 'mo_bai',
    requiredFriendship: 1600,
    title: '雨中琴声',
    scenes: [
      {
        text: '连日的阴雨让村子笼罩在一片灰蒙蒙之中。你路过墨白住的小屋，听到里面传来琴声——和往常不同，这次的琴声充满了焦躁和不安，像是暴雨中挣扎的飞鸟。'
      },
      {
        text: '你推门进去。墨白抱着琴缩在角落里，脸色苍白得吓人，手指在弦上胡乱拨弄着。看到你，他的目光恍惚了一瞬。"……你不该来。"他的声音嘶哑，"我今天状态不好。很不好。"'
      },
      {
        text: '"我这个人……有时候会陷进去，出不来。"他把脸埋进手臂里，"曲子写不出来的时候、下雨的时候、觉得世界上没有人在乎的时候……脑子里全是噪音。"',
        choices: [
          {
            text: '走过去，轻轻把手放在他的肩上。"我在这里。"',
            friendshipChange: 160,
            response:
              '墨白的身体颤了一下。过了很长时间，他才慢慢抬起头。他的眼眶红红的，声音像是从很远的地方传来："你知道吗……有人在这里，真的不一样。"他试着笑了笑，虽然笑容很浅，但是真实的。'
          },
          {
            text: '"那就别写了。今天什么都不做，就坐着。"',
            friendshipChange: 120,
            response:
              '墨白怔了怔。"什么都不做？"他好像从来没有考虑过这个选项。他慢慢放下琴，靠在墙上，闭上了眼睛。"……也好。什么都不做。"他的呼吸渐渐平缓下来。'
          }
        ]
      },
      {
        text: '你陪他坐了整整一个下午。雨声渐渐变得温柔了。傍晚时分，墨白重新拿起琴，弹了一首短曲——简单、平和、像是雨后的溪流。'
      },
      {
        text: '"以前低落的时候，我只有琴。"墨白轻声说，手指还在弦上缓缓滑动，"但琴不会回应我。今天……你来了。"他抬起头，目光里有一种从未有过的温度，"谢谢你没有走开。"'
      }
    ]
  },
  {
    id: 'mo_bai_heart_8',
    npcId: 'mo_bai',
    requiredFriendship: 2400,
    title: '知音',
    scenes: [
      {
        text: '入秋的某个傍晚，墨白找到你，递给你一张素笺。上面只有一行字："今夜子时，桥头。带上你的心。"字迹清秀而有力。'
      },
      {
        text: '子时，你来到村西的小桥。桥头两侧点着几盏素灯，灯光柔和得像月色。墨白坐在桥上，古琴横膝，白衫在夜风中轻轻飘动。见你来了，他的眼神像是终于等到了什么。'
      },
      {
        text: '"我为你写了一首曲子。"他的声音平静但带着微微的颤抖，"写了很久。改了很多遍。因为……这首曲子里放了一些我从来没有放进任何音乐里的东西。"他深吸一口气，指尖落在琴弦上。',
        choices: [
          {
            text: '安静地闭上眼睛，用心倾听。',
            friendshipChange: 120,
            response:
              '你闭上眼，让琴声填满每一个感官。曲子从孤独开始——冰冷、空旷，像是一个人走在无尽的荒野上。然后渐渐地，一个温暖的旋律加入进来，和孤独的主调交织在一起，最终融为一体。曲终时，你发现自己的眼角湿了。'
          },
          {
            text: '认真地注视着他弹琴的样子。',
            friendshipChange: 120,
            response:
              '你看着墨白的手指在琴弦上起落。他弹得很投入，微微闭着眼，嘴唇无声地动着，像是在诉说什么。你第一次发现——他弹琴的时候，忧郁全然消失了，取而代之的是一种纯粹的、发光的美。'
          }
        ]
      },
      {
        text: '最后一个音符消散在夜风中。墨白缓缓睁开眼，目光澄净得像一面湖。他轻轻将古琴放到一旁，站起身来。'
      },
      {
        text: '"这首曲子叫《知音》。"他的声音很低很低，像是怕惊碎了月光。"高山流水觅知音——我弹了十年的琴，走过很多地方，遇过很多人。但真正让我觉得「被听见」的……只有你。"他伸出手，指尖微微颤抖着，停在离你很近的地方。"我这个人阴晴不定，沉默寡言，有时候会把自己关起来。这样的我……你愿意做我一辈子的听众吗？"月光下，他的眼眶泛着微红，但嘴角有一弯浅浅的、真挚的笑意。'
      }
    ]
  },

  // ============================================================
  // 知己心事件 — 每NPC 2个 (zhiji_7 + zhiji_9)
  // ============================================================

  // --- 柳娘 知己 ---
  {
    id: 'liu_niang_zhiji_7',
    npcId: 'liu_niang',
    requiredFriendship: 1750,requiresZhiji: true,
    title: 'Moonlight Poetry Club',
    scenes: [
      {
        text: 'Liu Niang invites you to the pavilion in the backyard. The moonlight was like water, she spread out the rice paper and ground the ink. "The moonlight is so beautiful tonight, let's have a poetry party."'
      },
      {
        text: 'She first wrote: "Peach Blossom Temple in Taohuawu, Peach Blossom Fairy under Peach Blossom Temple." Then she handed the pen to you. "Between close friends, making friends through poetry is the most elegant thing."'
      },
      {
        text: 'You guys come and go and write a whole piece of paper. Liu Niang looked at the results and smiled. "Only the two of us can understand these verses from now on."',
        choices: [
          {
            text: '"Liu Niang's talent is amazing."',
            friendshipChange: 120,
            response: 'Liu Niang lowered her head and smiled. "With a confidant like {player}, talent is meaningful."'
          },
          {
            text: '"Come to the Poetry Club every full moon night from now on."',
            friendshipChange: 80,
            response: '"It's a deal." Liu Niang carefully put away the rice paper filled with poems. "This is our first page."'
          }
        ]
      }
    ]
  },
  {
    id: 'liu_niang_zhiji_9',
    npcId: 'liu_niang',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'Peach Blossom Note',
    scenes: [
      {
        text: 'Liu Niang took out an exquisite brocade box. "This is a flower note I made myself with peach petals. There are two in total. One for you and one for me."'
      },
      {
        text: '"Everything you want to say and poems you want to write in the future will be written on it." She looked at you seriously, "Even if you are not around each other, turning over the flower paper will feel like your best friend is still beside you."',
        choices: [
          {
            text: 'Taking the flower note solemnly. "The peach blossom notes mark the heart of a close friend and will be treasured for this lifetime."',
            friendshipChange: 160,
            response: 'Liu Niang's eyes were slightly red. "{player}...Having you as my confidant is the greatest luck in my life."'
          },
          {
            text: '"Liu Niang, I will fill it with words."',
            friendshipChange: 120,
            response: '"Hmm." Liu Niang gently opened the first page, and there was already a line of small words written on it: "A close friend is like an orchid, and you don't lose your beauty because you have no one."'
          }
        ]
      }
    ]
  },

  // --- A Shi confidant ---
  {
    id: 'a_shi_zhiji_7',
    npcId: 'a_shi',
    requiredFriendship: 1750,
    requiresZhiji: true,
    title: 'A promise deep in the mine',
    scenes: [
      {
        text: 'It's rare for Ah Shi to find you on his own initiative, holding two miner's lamps in his hands. "...Follow me. There's something I want you to see. Only close friends can do that."'
      },
      {
        text: 'He takes you to a hidden corner deep in the mine. Two parallel mineral veins, one gold and one silver, were naturally formed on the rock wall, winding and intertwined but never separated. '
      },
      {
        text: '"Two veins, not one... but always side by side. Like us."',
        choices: [
          {
            text: '"A stone...this is more precious than any gem."',
            friendshipChange: 120,
            response: 'Ashi smiled rarely. "Yeah. So I didn't touch it. Just leave it here."'
          },
          {
            text: '"You are such a friendly person."',
            friendshipChange: 80,
            response: 'A Shi turned away, his ears turning red. "...There should be a place for two people between close friends."'
          }
        ]
      },
      {
        text: 'Before leaving, Ah Shi carved two small symbols on the rock wall. "This way we can find this place later." He said, "Only the two of us know."'
      }
    ]
  },
  {
    id: 'a_shi_zhiji_9',
    npcId: 'a_shi',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'Rock Alliance',
    scenes: [
      { text: 'A Shi found you, holding a cloth bag in his hand. His expression was more serious than usual. ' },
      {
        text: 'He handed you the cloth bag - inside were two identical jade pendants, emerald green and transparent, strung with a red rope. "These are the only two loose stones in that vein. One for each man."'
      },
      {
        text: '"Stones from the same vein, no matter how far apart they are, are all one. So are close friends..."',
        choices: [
          {
            text: 'Hang the pendant solemnly around your neck. "The alliance of the rock will last forever."',
            friendshipChange: 160,
            response: 'Ashi also hung the other piece on his chest. He looked up at you, his eyes like crystals deep in a mine - quiet, but hot. "Yeah. Always."'
          },
          {
            text: '"Ashi, I am very lucky to have you as my close friend."',
            friendshipChange: 120,
            response: 'Ashi was silent for a long time, then nodded slightly. "...me too."'
          }
        ]
      }
    ]
  },

  // --- Qiuyue confidant ---
  {
    id: 'qiu_yue_zhiji_7',
    npcId: 'qiu_yue',
    requiredFriendship: 1750,
    requiresZhiji: true,
    title: 'Secret fishing spot',
    scenes: [{
        text: 'Qiuyue pulls you to a place you have never been before - there is a hidden pool under a small waterfall on the edge of the cliff. "This is my secret fishing spot! I never bring anyone else here!"'
      },
      {
        text: 'You sit side by side on the rock, each holding a pole. Qiuyue was quiet for a while, and then said: "A confidant is someone who can be in a daze together without being embarrassed."'
      },
      {
        text: 'Suddenly, the two fishing rods moved at the same time! You looked at each other and laughed at the same time. ',
        choices: [
          {
            text: '"Qiuyue, I will never be bored with you."',
            friendshipChange: 120,
            response: '"Of course!" Qiuyue raised her chin proudly, "This will be our secret base from now on! Hook!"'
          },
          {
            text: '"This fishing spot is really great!"',
            friendshipChange: 80,
            response: '"Right, right!" Qiuyue clapped her hands happily, "Only confidants are qualified to come here!"'
          }
        ]
      }
    ]
  },
  {
    id: 'qiu_yue_zhiji_9',
    npcId: 'qiu_yue',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'Pisces Knot',
    scenes: [
      {
        text: 'Qiuyue handed you a bracelet made of fishing line, with two small fish knots on it. "This is the fisherman's Pisces knot! It is said that two people who wear it will be good partners for life!"'
      },
      {
        text: '"It took me several days to compile it..." Qiuyue scratched her head, feeling a little embarrassed, "As a close friend, it would be nice to have a token!"',
        choices: [
          {
            text: 'Put it on your wrist immediately. "Pisces knot, never separate!"',
            friendshipChange: 160,
            response: 'Qiuyue also shook the identical bracelet on her wrist. "Hey! Now we are official confidants! No one can break us apart!"'
          },
          {
            text: '"Qiuyue, your skills are better than fishing."',
            friendshipChange: 120,
            response: '"Hahaha! I'm not being modest about this!" Qiuyue patted your shoulder and smiled like sunshine. "If anything happens in the future, my confidant will protect you!"'
          }
        ]
      }
    ]
  },

  // --- Chunlan confidant ---
  {
    id: 'chun_lan_zhiji_7',
    npcId: 'chun_lan',
    requiredFriendship: 1750,
    requiresZhiji: true,
    title: 'Tea Garden Night Talk',
    scenes: [
      {
        text: 'Chunlan invites you to taste tea deep in the tea garden. Under the moonlight, the leaves of the tea tree glow silver. She made a pot of tea that she never took out. "This tea is called "Zhijizui" and it is a recipe I created myself. "'
      },
      {
        text: '"I was the only one drinking here before, and I felt it was not worthy of the name. Chunlan lowered her head slightly, "Now that there is {player}... this name is finally worthy of her." "',
        choices: [
          {
            text: '"Chunlan, this is the best tea I have ever drunk. "',
            friendshipChange: 120,
            response: 'Chunlan smiled, the corners of her eyes curved like crescent moons. "From then on, every year new tea comes out, and the first cup will be reserved for you. "'
          },
          {
            text: '"Zhijizui...a good name. "',
            friendshipChange: 80,
            response: '"Because good tea needs to be tasted by close friends. Chunlan poured another glass for you, "Drink slowly, there is plenty of time tonight." "'
          }
        ]
      }
    ]
  },
  {
    id: 'chun_lan_zhiji_9',
    npcId: 'chun_lan',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'Purple clay pot',
    scenes: [
      {
        text: 'Chunlan held out a wooden box, inside was a pair of purple clay pots - the same shape, different sizes, with orchids engraved on the pot body. "This is a confidant pot passed down from our ancestors, one big and one small, one yin and one yang. "'
      },
      {
        text: '"It is said that if the teapots are separated, the tea will have a mediocre taste, but if they are brewed together, the tea will be particularly sweet. "She handed the small pot to you, "Leave the big pot at the tea house, and take the small pot with you. "',
        choices: [
          {
            text: 'Take the purple clay pot with both hands. "Chunlan, holding this pot in your hand is like having a close friend by your side. "',
            friendshipChange: 160,
            response: 'Chunlan gently placed the big pot in the most conspicuous position on the tea table. "When someone asks in the future, I will say - the other half of this pot is with my best friend. "'
          },
          {
            text: '"I will treasure it well. "',
            friendshipChange: 120,
            response: '"You should drink tea often. Chunlan smiled, "The pot must be used frequently to be effective." Just like a close friend... you need to keep in touch to last. "'
          }
        ]
      }
    ]
  },

  // --- Xueqin confidant ---
  {
    id: 'xue_qin_zhiji_7',
    npcId: 'xue_qin',
    requiredFriendship: 1750,
    requiresZhiji: true,
    title: 'Unknown Painting',
    scenes: [
      {
        text: 'Xueqin's studio is full of paintings. She pointed to a painting covered with cloth in the corner and said, "I have been painting that painting for three years and have never been satisfied with it. Come and see. "'
      },
      {
        text: 'Opening the cloth, there is a hazy landscape on the painting, but there is nothing in the center of the painting. "I always feel like something is missing and I can't continue painting. "'
      },
      {text: 'Xueqin picked up the brush, was silent for a while, and then drew two figures sitting side by side in the blank space. "...It turns out that this is what is missing."',
        choices: [
          {
            text: '"Xueqin, this painting... is the most touching I have ever seen."',
            friendshipChange: 120,
            response: 'Xue Qin rarely blushed. "...Stop boasting. From now on, this painting will be called "Picture of Confidant". It is not for sale."'
          },
          {
            text: '"It turns out that you have been looking for a confidant in your heart."',
            friendshipChange: 80,
            response: '"...Shut up." Xue Qin turned away, but the corners of her mouth were slightly raised. "But... you're right."'
          }
        ]
      }
    ]
  },
  {
    id: 'xue_qin_zhiji_9',
    npcId: 'xue_qin',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'You are in the painting',
    scenes: [
      { text: 'Xue Qin hands you a scroll. "Open it and take a look." Her tone was a little nervous. ' },
      {
        text: 'Unfold the scroll, it is a meticulous painting - the clothes and expressions of the people in the painting are exactly the same as yours, and the background is the four seasons of Taoyuan Township. The brushwork is so delicate that every peach petal is clearly visible. '
      },
      {
        text: '"It took me a long time to paint." Xue Qin whispered, "A good painting needs a good model. A good model... needs a person worth painting. You are the only person I am willing to paint for such a long time."',
        choices: [
          {
            text: '"Xueqin, I will hang this painting in the most conspicuous place at home."',
            friendshipChange: 160,
            response: 'Xue Qin's mouth finally showed a complete smile. "...Then when I get inspired, I will go to your house to paint. I am a close friend, so you are welcome."'
          },
          {
            text: '"This is the most precious gift I have ever received."',
            friendshipChange: 120,
            response: '"Humph." Xueqin turned her head awkwardly, but her voice was very soft. "There will be more in the future. Because...with a confidant around, inspiration will never run out."'
          }
        ]
      }
    ]
  },

  // --- Susu confidant ---
  {
    id: 'su_su_zhiji_7',
    npcId: 'su_su',
    requiredFriendship: 1750,
    requiresZhiji: true,
    title: 'Concentric knot',
    scenes: [
      {
        text: 'Susu is waiting for you in the backyard of the Silk House. There are various kinds of silk threads on the table. "I want to teach you to weave something." She said with a smile, "It's something that only close friends can weave - a concentric knot."'
      },
      {
        text: 'She patiently teaches you step by step threading and knotting. Occasionally, your fingers would touch each other, and Susu would retract slightly, and then continue. '
      },
      {
        text: 'Finally, two identical concentric knots are completed. One red and one green, intertwined. "The red one is my heart, and the green one is your heart." Su Su said softly, "If we tie them together, we can't separate them."',
        choices: [
          {
            text: '"Susu, I will always carry this knot with me."',
            friendshipChange: 120,
            response: 'Susu tied the red one on your wrist with gentle and careful movements. "Well... if we have close friends and we work together, everything will be possible."'
          },
          {
            text: '"Your craftsmanship is truly exquisite."',
            friendshipChange: 80,
            response: '"Because I made it up for my close friend, I took extra care." Su Su pursed her lips and smiled, and tied the cyan one around her wrist. '
          }
        ]
      }
    ]
  },
  {
    id: 'su_su_zhiji_9',
    npcId: 'su_su',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'Confidant Clothes',
    scenes: [
      {
        text: 'Susu took out a carefully sewn piece of clothing. The fabric is soft, the color is light and elegant, and the cuffs and collar are embroidered with fine patterns. "I made this dress for a whole month."'
      },
      {
        text: '"The material is high-quality silk that I have saved for a long time. The pattern is designed by myself - peach blossoms and orchid grass intertwined together, representing the love of close friends." Her eyes were bright, "Try it?"',
        choices: [
          {
            text: 'Put on your clothes and salute solemnly. "Susu, this dress is like the heart of a close friend, I will treasure it for life."',
            friendshipChange: 160,
            response: 'Susu's eyes were moist. "Well... every stitch is my heart. Wearing it on your body is like I am always by your side."'
          },
          {
            text: '"So beautiful, Susu. You are the best tailor."',
            friendshipChange: 120,
            response: '"It's because you are the best confidant." Susu helped you adjust your collar with gentle movements. "Good-looking...so beautiful."'
          }
        ]
      }
    ]
  },

  // --- Hongdou confidant ---
  {
    id: 'hong_dou_zhiji_7',
    npcId: 'hong_dou',
    requiredFriendship: 1750,
    requiresZhiji: true,
    title: 'Friendly Wine',
    scenes: [
      {
        text: 'Hongdou pulled you to the deepest part of the wine cellar and took down a jar of dusty wine from the top shelf. "My father buried this jar of wine when he was still alive. He said he could only open it when I meet my soulmate."'
      },
      {
        text: 'She patted open the mud, and the aroma of wine overflowed. Anko poured a full bowl for you, and also poured a bowl for herself. "Come on! Drink up the confidant wine!"'
      },
      {text: 'After one bowl, it is mellow and sweet, with a long aftertaste. Anko wiped the corners of her mouth, her eyes a little red. "My dad said that a good friend is rarer than wine. Once you meet one, don't let it go."',
        choices: [
          {
            text: '"Hongdou, this wine is more precious than anything else. So is the feeling of a close friend."',
            friendshipChange: 120,
            response: 'Hongdou slapped you hard. "Well said! Let's do another bowl! Hahaha!" He smiled, but tears fell down. "My father would be very happy if he were here..."'
          },
          {
            text: '"Thank you for sharing such an important wine with me."',
            friendshipChange: 80,
            response: '"Thank you for what!" Hongdou waved his hand boldly, "We don't say thank you between close friends! Come on, let's finish this jar!"'
          }
        ]
      }
    ]
  },
  {
    id: 'hong_dou_zhiji_9',
    npcId: 'hong_dou',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'Jiumeng',
    scenes: [
      {
        text: 'Hongdou set up a table of wine and food under the peach tree in the backyard of the winery. "Let's make it official today!" She took out two identical wine glasses from her arms, with the word "confidant" engraved on them. '
      },
      {
        text: '"From today on, this cup will be our confidant cup." Hongdou's serious look is completely different from his usual carefree attitude, "Heaven and earth are the evidence, and the peach blossoms are the matchmaker - we will become close friends, drink together, and face difficulties together!"',
        choices: [
          {
            text: 'Toast. "We have wine to drink together, and we share difficulties together! Do it!"',
            friendshipChange: 160,
            response: 'Two glasses collided, and the wine flew everywhere. Hongdou laughed loudly: "Happy! From today on, you are my best confidant!" She filled up the wine again, "Come, come, come, don't get drunk and you won't come back!"'
          },
          {
            text: '"Hongdou, you are more emotional than you look."',
            friendshipChange: 120,
            response: '"Hmph!" Hongdou blushed, "Don't think I won't be shy! ... But in front of my close friends, I won't pretend. Come on, drink!"'
          }
        ]
      }
    ]
  },

  // --- Danqing confidant ---
  {
    id: 'dan_qing_zhiji_7',
    npcId: 'dan_qing',
    requiredFriendship: 1750,
    requiresZhiji: true,
    title: 'Lanting Appointment',
    scenes: [
      {
        text: 'Danqing spread out pen, ink, paper and inkstone beside the stone table in the bamboo forest. "In the past, when Wang Xizhi held a gathering in Orchid Pavilion, all the talented people gathered there. Today, although there are only you and me, there is something special about it."'
      },
      {
        text: 'He soaked up the ink and wrote four words in one breath: "High mountains and flowing water". Then hand you the pen. "Between close friends, friends will be made friends through literature. Please."'
      },
      {
        text: 'You take turns writing, commenting, and talking about ancient and modern times. Danqing's eyes sparkled. "When Ziqi meets Boya, there is no need to say more words to get to know each other. {player}, you are my Ziqi."',
        choices: [
          {
            text: '"Danqing, your talent is heart-breaking. It is my honor to be your child."',
            friendshipChange: 120,
            response: 'Danqing smiled slightly and wrote two more words on the paper: "confidant". "These two words are given to {player}. They are framed and hung in the study room, where they can be seen every day."'
          },
          {
            text: '"High mountains and flowing rivers, it's hard to find a close friend. Fortunately, I got a picture."',
            friendshipChange: 80,
            response: '"Wonderful!" Danqing held her hands and laughed, "I want to record this sentence in my collection of poems. The words of a close friend are worth a thousand dollars."'
          }
        ]
      }
    ]
  },
  {
    id: 'dan_qing_zhiji_9',
    npcId: 'dan_qing',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'The Golden Cross',
    scenes: [
      {
        text: 'Danqing solemnly hands you a handwritten book. The words "Collection of Confidants" are written on the cover. "These are all the poems and essays I have written over the years - many of them were written after meeting {player}."'
      },
      {
        text: '"There is a saying in "The Book of Changes": Two people working together can cut through metal." Danqing's voice was gentle but firm, "Although I am a scholar, I don't have the power to tie a chicken. But if I know that I am in trouble, Danqing will never give up."',
        choices: [
          {
            text: '"Danqing, the friendship between gold and gold, this life will live up to it."',
            friendshipChange: 160,
            response: 'Danqing's eyes sparkled, but he quickly covered it up with a smile. "What a "fulfillment in this life"". {player}, with these four words of you, Danqing will have no regrets in this life. "'
          },
          {
            text: '"I will treasure this collection of close friends. "',
            friendshipChange: 120,
            response: '"Poetry is no more than paper and ink. Danqing shook his head, "What is truly precious is the friendship behind the paper and ink." {player}Just remember. "'
          }
        ]
      }
    ]
  },

  // --- Atie, confidant ---
  {
    id: 'a_tie_zhiji_7',
    npcId: 'a_tie',
    requiredFriendship: 1750,
    requiresZhiji: true,
    title: 'The Blacksmith's Secret',
    scenes: [
      {
        text: 'Ah Tie secretly pulled you behind the blacksmith shop. "There is, there is something... I only show it to my close friends. "He took out a strange-looking knife from the cabinet.'
      },
      {text: '"This is the first work I have completed alone... Master doesn't know." There are several obvious flaws on the blade, but the handle has the word "iron" crookedly engraved on it. '
      },
      {
        text: '"It's ugly, right..." Atie blushed and lowered his head, "But, but this is my most important thing. I want... to show it to my confidant."',
        choices: [
          {
            text: '"Atie, this knife is more meaningful than any magical weapon."',
            friendshipChange: 120,
            response: 'A Tie suddenly raised his head and his eyes lit up. "Really, really?! Then...then I will go out and give {player} a better one! For sure!"'
          },
          {
            text: '"Thank you for trusting me. This is how it should be between close friends."',
            friendshipChange: 80,
            response: '"Yeah!" Atie nodded vigorously, his ears red. "A confidant is...a person who can tell him the most embarrassing things!"'
          }
        ]
      }
    ]
  },
  {
    id: 'a_tie_zhiji_9',
    npcId: 'a_tie',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'Double iron bracelet',
    scenes: [
      {
        text: 'Atie ran to you sweating profusely. "It's done!" He carefully opened an iron box, and inside were two simple but polished iron bracelets. '
      },
      {
        text: '"This, this is what I made with the best iron! It took seven days and seven nights!" Atie blushed, "Master said that the best work of a blacksmith should be given to the most important person. A close friend... is the most important person!"',
        choices: [
          {
            text: 'Put on the iron bracelet and hold Ah Tie's hand heavily. "Brother!"',
            friendshipChange: 160,
            response: 'Ah Tie also put on the other one and shook your hand hard. "Bosom...friend! Closer than brothers! I, Atie, swear that I will take care of all your things from now on!"'
          },
          {
            text: '"Ah Tie, although this bracelet is made of iron, friendship is heavier than gold."',
            friendshipChange: 120,
            response: 'A Tie's eyes were red. "I, I don't know how to say nice things... but {player} you are my most important confidant! It will not change in this life!"'
          }
        ]
      }
    ]
  },

  // --- Yunfei confidant ---
  {
    id: 'yun_fei_zhiji_7',
    npcId: 'yun_fei',
    requiredFriendship: 1750,
    requiresZhiji: true,
    title: 'Eagle's Nest',
    scenes: [
      {
        text: 'Yunfei took you up to the highest cliff of the back mountain. There is a lone pine on the top of the peak, and there is a huge eagle's nest on the pine branch. "I have guarded this Eagle's Nest for three years."'
      },
      {
        text: 'A goshawk circled and landed on a pine branch, but it was not scared away by your presence. "It believes in me." Yunfei said, "Now...it believes in you too."'
      },
      {
        text: '"I don't bring people here easily." Yunfei looked at the distant mountains, his voice was rare and gentle, "But you are a confidant. Everything here...is also yours."',
        choices: [
          {
            text: '"Yunfei, you shared your most precious secret with me."',
            friendshipChange: 120,
            response: 'Yunfei was silent for a long time, and then said two words softly: "It's worth it." The goshawk was circling in the sunset, as if it was watching for you. '
          },
          {
            text: '"Thank you for your trust."',
            friendshipChange: 80,
            response: '"...No need to thank you." The corner of Yunfei's mouth rose almost imperceptibly, "A close friend would not say such nonsense."'
          }
        ]
      }
    ]
  },
  {
    id: 'yun_fei_zhiji_9',
    npcId: 'yun_fei',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'Hunter's Appointment',
    scenes: [
      {
        text: 'Yunfei stuck a dagger on the ground between you. The blade shone coldly in the moonlight. "This knife has been with me for ten years."'
      },
      {
        text: '"Hunters have a rule - lending your sword to another person means lending your life to him." Yunfei looked directly into your eyes, "I'll give it to you."',
        choices: [
          {
            text: 'Pick up the dagger and put it into your arms solemnly. "Your life is my life."',
            friendshipChange: 160,
            response: 'Yunfei smiled rarely - not a sarcastic smile, not a sneer, but a real, heartfelt smile. "...Okay. From now on in the mountains, I will watch your back."'
          },
          {
            text: '"Yunfei...this is too expensive."',
            friendshipChange: 120,
            response: '"If you think it's too valuable, don't treat me as a confidant." Yunfei glared at you and then sighed. "Keep it. I've long wanted to find someone trustworthy to share the burden with."'
          }
        ]
      }
    ]
  },

  // --- Daniel confidant ---
  {
    id: 'da_niu_zhiji_7',
    npcId: 'da_niu',
    requiredFriendship: 1750,
    requiresZhiji: true,
    title: 'The Oath of Milk',
    scenes: [
      {
        text: 'Daniu excitedly pulled you to the bullpen. "Come on, come on! Fubao has produced milk today! The first bowl must be given to your confidant!"'
      },
      {
        text: 'He poured the fresh milk clumsily into two bowls, spilling it all over the table. "Hey... my hands are shaking."'},
      {
        text: 'The big cow raised the bowl. "I'm a big cow with no culture and can't speak nice words. But I know - a good brother is someone who can drink milk with us! Do it!"',
        choices: [
          {
            text: 'Lift the bowl and drink it all in one gulp. "Good brothers! Drink milk together and conquer the world together!"',
            friendshipChange: 120,
            response: '"Yes!" Da Niu patted his chest, "From now on, my cows are your cows! My pasture is your pasture! You are a close friend!"'
          },
          {
            text: '"Daniu, you are better at talking than you think."',
            friendshipChange: 80,
            response: '"Yes, really?" The big cow scratched his head and grinned, "Hey, being praised by your confidant! I'm happier than being licked by ten cows!"'
          }
        ]
      }
    ]
  },
  {
    id: 'da_niu_zhiji_9',
    npcId: 'da_niu',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'Grassland Alliance',
    scenes: [
      {
        text: 'Da Niu hung a newly carved wooden sign on the pasture fence. Two names are crookedly written on it - his and yours. '
      },
      {
        text: '"From today on, this ranch belongs to the two of us!" Daniel's eyes turned red, "I have always dreamed of having a partner... A confidant is the best partner!"',
        choices: [
          {
            text: 'Pat the bull on the shoulder. "The Ranch Alliance will never go back on its word!"',
            friendshipChange: 160,
            response: 'Daniu nodded vigorously, then hugged you and almost strangled you. "That's great! We are friends and partners! We are invincible! I'm going to give the cow a meal to celebrate!"'
          },
          {
            text: '"Daniu, I am lucky to have you as my close friend."',
            friendshipChange: 120,
            response: 'Danniu burst into tears. "Woo... {player}, stop talking... I can't control myself when I'm moved... Wuwu... But I'm so happy!"'
          }
        ]
      }
    ]
  },

  // --- Mo Bai confidant ---
  {
    id: 'mo_bai_zhiji_7',
    npcId: 'mo_bai',
    requiredFriendship: 1750,
    requiresZhiji: true,
    title: 'Song without Words',
    scenes: [
      {
        text: 'Mo Bai played a piece of music you had never heard before under the moonlight. The melody is sometimes cheerful, sometimes melancholy, and finally peaceful. After he finished playing, he looked at you quietly. '
      },
      {
        text: '"This piece of music has no name and no words." He said softly, "because it is not for listening to - it is for "feeling". Only close friends... can feel it. "',
        choices: [
          {
            text: '"Mo Bai, I heard it. Joy, sorrow, relief...it's all in it. "',
            friendshipChange: 120,
            response: 'Mo Bai was stunned. Then he lowered his head and lightly brushed his fingers over the strings. "…You really understand. You are the first in ten years. "'
          },
          {
            text: '"This song is beautiful. "',
            friendshipChange: 80,
            response: '"Beautiful? "Mo Bai shook his head, "No, this song is "real". Only in front of my best friend can I play "real" music. "'
          }
        ]
      }
    ]
  },
  {
    id: 'mo_bai_zhiji_9',
    npcId: 'mo_bai',
    requiredFriendship: 2250,
    requiresZhiji: true,
    title: 'Zhiyin Qin',
    scenes: [
      {
        text: 'Mo Bai opened a piano case that you have never seen before. Inside lies a simple little piano with the word "Zhiyin" engraved on its body. "This piano was left to me by my master. He said that when I find a soulmate, I will spread the word. "'
      },
      {
        text: '"You don't have to be able to play. "Mo Bai gently handed the piano to your hand, "As long as it's by your side, it's like the sound of my piano is always with you. "There was rare tenderness in his eyes." Boya threw the piano for Ziqi... I can't. Because you are here. "',
        choices: [
          {
            text: 'Take the guqin with both hands. "With the Zhiyin Qin in my hand, I feel like I can hear the sound of white ink. In this life, I will not be a child, I will be your eternal listener. "',
            friendshipChange: 160,
            response: 'Mo Bai closed his eyes and gently plucked the strings on his piano. That note lingered in the night sky for a long time. "…Okay. forever. "'
          },
          {
            text: '"Mo Bai, I will take good care of this piano. "',
            friendshipChange: 120,
            response: '"No need to keep it. "Mo Bai smiled slightly and said, "You have to play the piano. One day you learn the first note, play it for me. "'
          }
        ]
      }
    ]
  }
]

/** Wedding event definition (general, npcId is replaced at runtime) */
export const WEDDING_EVENT: HeartEventDef = {
  id: 'wedding_ceremony',
  npcId: '',
  requiredFriendship: 0,
  title: 'Hundred Years of Love',
  scenes: [
    {
      text: 'Today is the day you have been waiting for. The early morning sunshine shines on the square of Taoyuan Township, and the villagers have arranged red silk and lanterns early. Uncle Chen greeted the visitors with a smile at the door, while Aunt Wang was busy preparing for the wedding banquet. '
    },
    {
      text: 'You put on a brand new wedding dress and stood in the middle of the square. As a witness to the marriage, Village Chief Liu cleared his throat and said, "Today is an auspicious day, and another happy event has been added to Taoyuan Township. "The crowd cheered.'
    },
    {text: 'Your sweetheart is walking slowly, wearing a red dress and a shy smile. You exchanged tokens under the witness of everyone. Village Chief Liu announced: "The ceremony is complete! Let's live a happy life together for a hundred years!"'
    },
    {
      text: 'At the wedding banquet, the fat aunt brought her signature dishes, Lao Lu brought out the fine wine from his collection, and Zhou Xiucai wrote an impromptu congratulatory message. Xiaoman and Shitou were eating snacks under the table, and Ahua stared at you curiously. The entire Taoyuan Township was immersed in joy. '
    },
    {
      text: 'Night falls and the guests disperse. You return to your warm home and start a new life. From now on, this is no longer just your farm - it's your shared home. '
    }
  ]
}

/** Get all NPC events based on their ID */
export const getHeartEventsForNpc = (npcId: string): HeartEventDef[] => {
  return HEART_EVENTS.filter(e => e.npcId === npcId)
}

/** Get the heart event definition based on the event ID */
export const getHeartEventById = (id: string): HeartEventDef | undefined => {
  return HEART_EVENTS.find(e => e.id === id)
}