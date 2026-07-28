(function (global) {
  'use strict';

  var STORAGE_KEY = 'life_stub_data';
  var ACTIVE_KEY = 'life_stub_active';

  // ── 默认示例数据 ──
  var SEED_DATA = [
    {
      id: 'stub-1',
      name: '他',
      details: [
        {
          id: 'd1', date: '三月十四日', weather: '晴',
          body: [
            '他喝茶的时候，习惯先把杯子转三圈，再轻轻吹一下。',
            '那个带茶垢的旧瓷杯，杯口有一道细裂纹，他说那是"岁月的吻痕"。'
          ],
          tags: ['习惯', '茶', '物品']
        },
        {
          id: 'd2', date: '四月二日', weather: '雨',
          body: [
            '他说话会带一句"你晓得伐"，说了二十多年，改不掉。',
            '吵架的时候也会说，听起来格外滑稽。'
          ],
          tags: ['语言', '口头禅']
        },
        {
          id: 'd3', date: '四月十五日', weather: '多云',
          body: [
            '他走路的时候，左脚微微有点拖，是年轻时受伤留下的。',
            '我现在在超市里听到类似的脚步声，还是会愣住。'
          ],
          tags: ['身体', '声音']
        },
        {
          id: 'd4', date: '五月一日', weather: '晴',
          body: [
            '他做菜放盐的顺序很奇怪：先盐后糖再酱油。',
            '女儿说"这不对"，但他坚持说"这样才有层次"。'
          ],
          tags: ['习惯', '食物', '厨房']
        },
        {
          id: 'd5', date: '六月八日', weather: '夜',
          body: [
            '他看书时会把书页折一个很小的角，只有我能找到他读到了哪里。',
            '他走的那天，桌上摊着一本《浮生六记》，正翻在卷二。'
          ],
          tags: ['物品', '阅读']
        }
      ],
      emotions: [
        {
          id: 'e1', date: '三月二十日',
          lines: [
            '我买了他爱喝的碧螺春，泡茶的时候手在抖。',
            '水倒进去，茶叶翻上来，像他当年做的那样。',
            '可是今天，只有我一个人喝。'
          ]
        },
        {
          id: 'e2', date: '四月四日',
          lines: [
            '去菜场，路过他常买的那家豆腐摊。',
            '"两块嫩豆腐。"我脱口而出，才意识到他已经不在了。',
            '摊主看着我，我笑了一下，眼睛湿了。',
            '原来有些话，不是用来说的，是用来留的。'
          ]
        },
        {
          id: 'e3', date: '五月十二日',
          lines: [
            '今天我没哭。',
            '不是因为不想，是因为哭累了。',
            '我坐在阳台上，看了一下午的云。',
            '风把窗帘吹起来，我好像听到他在书房翻书的声音。',
            '也可能只是风。'
          ]
        },
        {
          id: 'e4', date: '六月十九日',
          lines: [
            '朋友说"时间会冲淡一切"。',
            '我没反驳，因为反驳了也只是让她尴尬。',
            '但我心里想的是——我不想被冲淡。',
            '那些细节本来就是我的一部分，',
            '为什么要被冲掉？'
          ]
        }
      ],
      connections: [
        { id: 'c1', label: '说话方式', desc: '现在我也会说"你晓得伐"，女儿学去了，外孙女也在学' },
        { id: 'c2', label: '饮食习惯', desc: '先盐后糖再酱油，我已经改不回来了' },
        { id: 'c3', label: '阅读习惯', desc: '看书折小角，现在家里每个人都这么做' },
        { id: 'c4', label: '喝茶仪式', desc: '转三圈，吹一下，已经变成我们家的喝茶规矩' },
        { id: 'c5', label: '走路节奏', desc: '偶尔我会发现自己走路左脚有点拖，原来是跟他学的' }
      ],
      anchors: [
        { id: 'a1', icon: '🎵', title: '2019年的一段录音', desc: '他在厨房唱歌，跑调跑得离谱', meta: '时长 47秒 · 录音' },
        { id: 'a2', icon: '✉️', title: '一封没有寄出的信', desc: '2017年3月，他写的，放在抽屉最里面', meta: '文字 · 3页' },
        { id: 'a3', icon: '📷', title: '阳台晒太阳的照片', desc: '2020年冬天，他眯着眼睛，手放在膝盖上', meta: '照片 · 3张' },
        { id: 'a4', icon: '🍵', title: '那只带茶垢的旧瓷杯', desc: '杯口有裂纹，他说是"岁月的吻痕"', meta: '物品 · 已保存' },
        { id: 'a5', icon: '📖', title: '《浮生六记》卷二', desc: '他走的那天，桌上摊着的那本书', meta: '物品 · 页码有折痕' }
      ]
    },
    {
      id: 'stub-2',
      name: '王阿姨',
      details: [
        {
          id: 'd1', date: '二月初七', weather: '晴',
          body: [
            '王阿姨敲门总用指节敲三下，停两秒，再敲两下。',
            '她的指甲剪得很短，指节上有层薄薄的茧，是常年做家务磨的。'
          ],
          tags: ['习惯', '声音', '身体']
        },
        {
          id: 'd2', date: '四月十八', weather: '多云',
          body: [
            '王阿姨送菜总用那种泛黄的塑料袋，打好结还要再套一层。',
            '她说是"怕漏了"，其实袋子里只是一把刚摘的青菜。'
          ],
          tags: ['习惯', '食物', '物品']
        },
        {
          id: 'd3', date: '六月廿二', weather: '雨',
          body: [
            '王阿姨收衣服的时候，每件都要抖三下再叠，说"把灰尘抖掉"。',
            '她叠衣服有固定的折法，每件衣服叠出来都是一样大小的方块。'
          ],
          tags: ['习惯', '雨天', '家务']
        },
        {
          id: 'd4', date: '九月初九', weather: '晴',
          body: [
            '王阿姨晒被子总选上午十点，她说"这时候的太阳最软和"。',
            '她用的竹竿是老竹子做的，两头都包着红布，怕刮破被子。'
          ],
          tags: ['习惯', '秋天', '物品']
        },
        {
          id: 'd5', date: '腊月廿八', weather: '雪',
          body: [
            '王阿姨过年总要炸丸子，一锅炸二十个，不多也不少。',
            '她炸丸子站在灶台前，手里的长筷子翻得很快，油星子溅到手上也不躲。'
          ],
          tags: ['食物', '过年', '雪']
        }
      ],
      emotions: [],
      connections: [],
      anchors: [
        { id: 'a1', icon: '🥬', title: '那把总送不完的青菜', desc: '她自己在阳台种的，说"外面买的不如自己种的放心"', meta: '物品 · 常出现' },
        { id: 'a2', icon: '🚪', title: '三下两下的敲门声', desc: '不用开门就知道是她，节奏从来没变过', meta: '声音 · 记忆' },
        { id: 'a3', icon: '🧺', title: '那个泛黄的菜篮子', desc: '竹编的，提手处磨得发亮，她用了二十多年', meta: '物品 · 保存' }
      ]
    },
    {
      id: 'stub-3',
      name: '修车大爷',
      details: [
        {
          id: 'd1', date: '三月初三', weather: '晴',
          body: [
            '大爷补胎前，总爱把内胎打满气，放在水盆里一圈一圈转。',
            '他找漏气点的时候，眉头皱着，嘴唇抿成一条线，找到时才松开。'
          ],
          tags: ['手艺', '习惯', '表情']
        },
        {
          id: 'd2', date: '五月十二', weather: '多云',
          body: [
            '大爷的工具箱永远敞着盖，工具摆得整整齐齐，像列队的士兵。',
            '他拿扳手的时候，总是先在围裙上擦两下，再伸手去拿。'
          ],
          tags: ['习惯', '工具', '物品']
        },
        {
          id: 'd3', date: '七月十五', weather: '雨',
          body: [
            '下雨天王大爷也出摊，撑着一把大蓝伞，伞骨断了两根，用铁丝绑着。',
            '他坐在小马扎上，手里搓着一根麻绳，雨下大了就往伞里缩缩。'
          ],
          tags: ['雨天', '习惯', '物品']
        },
        {
          id: 'd4', date: '十月廿一', weather: '晴',
          body: [
            '大爷给车链子上油，总爱用一根旧牙刷，刷完在车轮上敲两下。',
            '他的旧牙刷有五六把，插在工具箱侧面的布兜里，各有用处。'
          ],
          tags: ['手艺', '工具', '习惯']
        },
        {
          id: 'd5', date: '腊月初五', weather: '雪',
          body: [
            '下雪天王大爷戴的那双线手套，指尖磨破了，露出半截手指头。',
            '他说"戴厚手套拧螺丝没感觉"，冻得手通红也不肯换。'
          ],
          tags: ['冬天', '雪', '身体']
        }
      ],
      emotions: [],
      connections: [],
      anchors: [
        { id: 'a1', icon: '🔧', title: '那把磨亮的扳手', desc: '他最常用的一把，手柄处包着胶布', meta: '物品 · 工具箱' },
        { id: 'a2', icon: '☂️', title: '断了两根骨的蓝伞', desc: '下雨天撑着，伞沿往下滴水', meta: '物品 · 记忆' },
        { id: 'a3', icon: '🪑', title: '那个小马扎', desc: '他坐了十几年，腿上缠了好几圈铁丝', meta: '物品 · 摊位' }
      ]
    },
    {
      id: 'stub-4',
      name: '老猫',
      details: [
        {
          id: 'd1', date: '四月初五', weather: '晴',
          body: [
            '老猫晒太阳总爱趴在外婆家的窗台上，把身子拉得很长，像一块摊开的饼。',
            '它的左耳朵缺了一小块，是年轻时候跟别的猫打架留下的。'
          ],
          tags: ['习惯', '春天', '身体']
        },
        {
          id: 'd2', date: '六月十八', weather: '多云',
          body: [
            '老猫吃饭的时候，总爱先用爪子扒拉两下碗边，再低下头吃。',
            '它的碗是个旧瓷碗，碗边有个豁口，是它自己碰掉的。'
          ],
          tags: ['习惯', '食物', '物品']
        },
        {
          id: 'd3', date: '八月廿三', weather: '雨',
          body: [
            '下雨天老猫总爱钻到床底下，缩成一团，只露出两只眼睛。',
            '它怕打雷，雷声一响，耳朵就往后贴，尾巴紧紧夹在腿中间。'
          ],
          tags: ['雨天', '习惯', '表情']
        },
        {
          id: 'd4', date: '十月十六', weather: '晴',
          body: [
            '老猫舔毛的时候，总爱从左前爪开始，舔完爪子再洗脸。',
            '它的胡子全白了，右边那几根比左边的短，是老了以后掉的。'
          ],
          tags: ['习惯', '身体', '秋天']
        },
        {
          id: 'd5', date: '冬月廿七', weather: '雪',
          body: [
            '下雪天猫总爱蜷在外婆的脚边，把脑袋埋进肚子里，只露个尾巴尖。',
            '它的爪子上有块老茧，是常年爬树磨的，现在不爬了，茧还在。'
          ],
          tags: ['冬天', '雪', '习惯']
        }
      ],
      emotions: [],
      connections: [],
      anchors: [
        { id: 'a1', icon: '🐱', title: '缺了一块的左耳朵', desc: '年轻时打架留下的，像个小标记', meta: '身体 · 特征' },
        { id: 'a2', icon: '🥣', title: '那个有豁口的瓷碗', desc: '它自己碰掉的，用了好多年', meta: '物品 · 饭碗' },
        { id: 'a3', icon: '☀️', title: '窗台上的太阳地', desc: '它最爱趴的地方，毛晒得暖暖的', meta: '地点 · 记忆' }
      ]
    },
    {
      id: 'stub-5',
      name: '室友',
      details: [
        {
          id: 'd1', date: '九月开学', weather: '晴',
          body: [
            '他叠被子总爱叠成豆腐块，边角用手捏得笔直，说"这是军训留下的毛病"。',
            '他的枕头永远摆得方方正正，枕巾上有一道折痕，是他每晚压出来的。'
          ],
          tags: ['习惯', '物品', '开学']
        },
        {
          id: 'd2', date: '十一月中旬', weather: '多云',
          body: [
            '他泡方便面总爱打两个鸡蛋，一个卧在面上，一个搅在汤里。',
            '他说"这样既有口感又有营养"，其实就是懒，不想下楼吃饭。'
          ],
          tags: ['食物', '习惯', '宿舍']
        },
        {
          id: 'd3', date: '一月期末', weather: '雪',
          body: [
            '考试前他总爱咬笔帽，一支新笔用不了三天，笔帽就全是牙印。',
            '他背书的时候脚会抖，抖得桌子都晃，说"这样脑子转得快"。'
          ],
          tags: ['习惯', '考试', '冬天']
        },
        {
          id: 'd4', date: '三月开春', weather: '雨',
          body: [
            '下雨天他总忘了带伞，淋着雨回来，第一件事就是脱鞋倒雨水。',
            '他的白球鞋永远是脏的，鞋尖处总蹭着黑，说"白鞋就是要脏才好看"。'
          ],
          tags: ['雨天', '物品', '习惯']
        },
        {
          id: 'd5', date: '六月毕业', weather: '夜',
          body: [
            '毕业那天晚上，他坐在上铺弹吉他，弹到一半弦断了一根。',
            '他没换弦，就那样用五根弦弹完了整首歌，手指头上都是茧。'
          ],
          tags: ['毕业', '夜晚', '物品']
        }
      ],
      emotions: [],
      connections: [],
      anchors: [
        { id: 'a1', icon: '🎸', title: '那把断了一根弦的吉他', desc: '毕业那晚弹的，后来一直没换弦', meta: '物品 · 宿舍' },
        { id: 'a2', icon: '🍜', title: '两个鸡蛋的泡面', desc: '一个卧着一个搅碎，他的固定搭配', meta: '食物 · 记忆' },
        { id: 'a3', icon: '🛏️', title: '豆腐块被子', desc: '他叠了四年，我们学了四年也没学会', meta: '习惯 · 宿舍' }
      ]
    },
    {
      id: 'stub-6',
      name: '驴友',
      details: [
        {
          id: 'd1', date: '五一假期', weather: '晴',
          body: [
            '他打包行李总爱用那种分装袋，每样东西都有固定的位置。',
            '他的背包是军绿色的，肩带上磨起了毛，是走了很多路磨的。'
          ],
          tags: ['习惯', '物品', '旅行']
        },
        {
          id: 'd2', date: '七月盛夏', weather: '多云',
          body: [
            '他走路的时候总爱数步数，走一百步就抬头看看远方，说"这样不累"。',
            '他的登山杖是铝合金的，手柄处缠了胶带，是他自己缠的。'
          ],
          tags: ['习惯', '物品', '夏天']
        },
        {
          id: 'd3', date: '九月深秋', weather: '雨',
          body: [
            '下雨天他总爱把冲锋衣的帽子拉得很低，只露出鼻子和眼睛。',
            '他的冲锋衣口袋里永远装着一块巧克力，说"关键时刻能救命"。'
          ],
          tags: ['雨天', '习惯', '物品']
        },
        {
          id: 'd4', date: '十月金秋', weather: '晴',
          body: [
            '他拍风景总爱蹲下来，把相机贴在地上，说"低角度才有感觉"。',
            '他的相机是老款的胶片机，镜头上有一道划痕，是上次摔的。'
          ],
          tags: ['习惯', '物品', '秋天']
        },
        {
          id: 'd5', date: '腊月寒冬', weather: '雪',
          body: [
            '下雪天他总爱走在前面踩雪，脚印踩得深深的，让后面的人跟着走。',
            '他的靴子是棕色的，鞋头处磨白了，是踢石头踢的。'
          ],
          tags: ['冬天', '雪', '习惯']
        }
      ],
      emotions: [],
      connections: [],
      anchors: [
        { id: 'a1', icon: '🎒', title: '军绿色的旧背包', desc: '肩带磨起毛，里面永远装得满满的', meta: '物品 · 旅行' },
        { id: 'a2', icon: '📷', title: '那台老胶片机', desc: '镜头有划痕，拍出来的照片却特别好看', meta: '物品 · 记忆' },
        { id: 'a3', icon: '🍫', title: '口袋里的巧克力', desc: '他说关键时刻能救命，其实每次都自己偷偷吃了', meta: '食物 · 习惯' }
      ]
    },
    {
      id: 'stub-7',
      name: '陌生人',
      details: [
        {
          id: 'd1', date: '三月初春', weather: '晴',
          body: [
            '她总坐在图书馆三楼靠窗的位置，桌上永远摆着一杯柠檬水。',
            '她喝水的时候，总爱用左手扶着杯壁，右手翻书，动作很轻。'
          ],
          tags: ['习惯', '图书馆', '物品']
        },
        {
          id: 'd2', date: '五月初夏', weather: '多云',
          body: [
            '她看书的时候总爱咬下唇，看到精彩处，眉头会微微皱一下。',
            '她的笔记本是深蓝色的，封面上有一朵白色的花，是她自己画的。'
          ],
          tags: ['习惯', '表情', '物品']
        },
        {
          id: 'd3', date: '七月三伏', weather: '雨',
          body: [
            '下雨天她总带一把透明的伞，伞柄上挂着一个小铃铛，走起路来叮铃响。',
            '她收伞的时候总爱甩三下，再把伞套套上，动作不紧不慢的。'
          ],
          tags: ['雨天', '物品', '习惯']
        },
        {
          id: 'd4', date: '九月秋凉', weather: '晴',
          body: [
            '她离开图书馆的时候，总爱把椅子轻轻推回桌子底下，再整理一下桌面。',
            '她的书包是帆布的，上面别着好几枚徽章，每一枚都不一样。'
          ],
          tags: ['习惯', '物品', '秋天']
        },
        {
          id: 'd5', date: '腊月寒冬', weather: '雪',
          body: [
            '下雪天她总围着一条米白色的围巾，把半张脸都埋在围巾里。',
            '她的手套是露指的，露出半截手指头，方便翻书，冻得红红的。'
          ],
          tags: ['冬天', '雪', '物品']
        }
      ],
      emotions: [],
      connections: [],
      anchors: [
        { id: 'a1', icon: '🍋', title: '那杯柠檬水', desc: '永远摆在桌上同一个位置，温温的', meta: '物品 · 图书馆' },
        { id: 'a2', icon: '☂️', title: '带铃铛的透明伞', desc: '收伞前总要甩三下，叮铃叮铃的', meta: '物品 · 声音' },
        { id: 'a3', icon: '📘', title: '深蓝色笔记本', desc: '封面上有朵白花，是她自己画的', meta: '物品 · 记忆' }
      ]
    },
    {
      id: 'stub-8',
      name: '师傅',
      details: [
        {
          id: 'd1', date: '七月入职', weather: '晴',
          body: [
            '师傅教东西总爱先说三遍，再让你自己做一遍，最后再纠正。',
            '他的钢笔是黑色的，笔帽上有道划痕，是他刚工作时摔的。'
          ],
          tags: ['习惯', '工作', '物品']
        },
        {
          id: 'd2', date: '九月秋初', weather: '多云',
          body: [
            '师傅喝咖啡总爱放两块糖，搅六下，不多也不少，说"这样甜度刚好"。',
            '他的咖啡杯是白瓷的，杯身上印着公司logo，用了快十年了。'
          ],
          tags: ['习惯', '食物', '物品']
        },
        {
          id: 'd3', date: '冬月加班', weather: '雨',
          body: [
            '加班晚了师傅总爱泡一碗泡面，泡三分钟，准时开盖，说"泡久了烂"。',
            '他的手表是机械表，每天早上七点半上发条，从来没忘过。'
          ],
          tags: ['加班', '食物', '习惯']
        },
        {
          id: 'd4', date: '正月返工', weather: '晴',
          body: [
            '师傅开会总爱坐最后一排，手里转着笔，眼睛盯着讲台，从不走神。',
            '他的笔记本是活页的，每页都写得整整齐齐，字不大，但很清楚。'
          ],
          tags: ['习惯', '工作', '物品']
        },
        {
          id: 'd5', date: '三月离职', weather: '夜',
          body: [
            '我离职那天，师傅送我到电梯口，拍了拍我肩膀，说"以后常联系"。',
            '他的手掌很大，很暖和，拍肩膀的时候，我闻到他身上有淡淡的烟草味。'
          ],
          tags: ['离别', '夜晚', '身体']
        }
      ],
      emotions: [],
      connections: [],
      anchors: [
        { id: 'a1', icon: '✒️', title: '那支带划痕的钢笔', desc: '他刚工作时摔的，用了十几年', meta: '物品 · 工作' },
        { id: 'a2', icon: '☕', title: '两块糖六下搅拌的咖啡', desc: '他的固定搭配，说这样甜度刚好', meta: '习惯 · 记忆' },
        { id: 'a3', icon: '📓', title: '那本活页笔记本', desc: '每页都写得整整齐齐，字不大但很清楚', meta: '物品 · 工作' }
      ]
    },
    {
      id: 'stub-9',
      name: '老槐树',
      details: [
        {
          id: 'd1', date: '四月开花', weather: '晴',
          body: [
            '老槐树开花的时候，满树都是白色的小花，风一吹，花瓣落一地，像下了场雪。',
            '树干上有个大树洞，是小时候我藏秘密的地方，现在还在。'
          ],
          tags: ['春天', '花', '地点']
        },
        {
          id: 'd2', date: '六月盛夏', weather: '多云',
          body: [
            '夏天的午后，老槐树下总坐着乘凉的人，摇着蒲扇，说着家长里短。',
            '树影在地上晃来晃去，像一幅会动的画，看着看着就睡着了。'
          ],
          tags: ['夏天', '阴凉', '声音']
        },
        {
          id: 'd3', date: '八月秋雨', weather: '雨',
          body: [
            '下雨的时候，雨水顺着树叶往下滴，滴在地上的水洼里，一圈一圈的涟漪。',
            '树干上的青苔被雨打湿了，颜色变得很深，闻起来有股泥土的味道。'
          ],
          tags: ['雨天', '声音', '气味']
        },
        {
          id: 'd4', date: '十月深秋', weather: '晴',
          body: [
            '秋天叶子黄了，风一吹，叶子哗哗往下掉，铺了厚厚一层，踩上去沙沙响。',
            '最高的那根树枝上，有个老鸦窝，不知道什么时候搭的，一直都在。'
          ],
          tags: ['秋天', '落叶', '声音']
        },
        {
          id: 'd5', date: '腊月寒冬', weather: '雪',
          body: [
            '下雪天，老槐树的枝桠上积满了雪，沉甸甸的，像挂满了棉花糖。',
            '树干上的纹路很清晰，一道一道的，像老人的手，记录着年岁。'
          ],
          tags: ['冬天', '雪', '身体']
        }
      ],
      emotions: [],
      connections: [],
      anchors: [
        { id: 'a1', icon: '🕳️', title: '那个大树洞', desc: '小时候藏秘密的地方，现在还在', meta: '地点 · 记忆' },
        { id: 'a2', icon: '🌸', title: '四月的槐花', desc: '风一吹就落一地，像下了场雪', meta: '季节 · 花' },
        { id: 'a3', icon: '🐦', title: '最高枝上的老鸦窝', desc: '不知道什么时候搭的，一直都在', meta: '地点 · 生命' }
      ]
    },
    {
      id: 'stub-10',
      name: '阿婆',
      details: [
        {
          id: 'd1', date: '三月开春', weather: '晴',
          body: [
            '阿婆拿糖总爱从玻璃罐里掏，掏的时候眼睛眯着，说"给你拿个大的"。',
            '她的手背上有很多老人斑，手指瘦瘦的，指甲剪得很整齐。'
          ],
          tags: ['食物', '身体', '习惯']
        },
        {
          id: 'd2', date: '五月端午', weather: '多云',
          body: [
            '阿婆的小卖部柜台是木头做的，边角磨得很光滑，是被人摸多了。',
            '她算账总用算盘，噼里啪啦的，算完还要再拨一遍，说"怕错了"。'
          ],
          tags: ['物品', '习惯', '声音']
        },
        {
          id: 'd3', date: '七月三伏', weather: '雨',
          body: [
            '下雨天阿婆总爱坐在门口的竹椅上，手里织着毛衣，看着街上来往的人。',
            '她的竹椅扶手上有个缺口，是被我小时候磕的，她一直没舍得换。'
          ],
          tags: ['雨天', '物品', '习惯']
        },
        {
          id: 'd4', date: '九月开学', weather: '晴',
          body: [
            '开学的时候阿婆总爱多给一块橡皮，说"读书用得上"，不收钱。',
            '她的老花镜是黑框的，镜腿松了，用橡皮筋绑着，凑合用。'
          ],
          tags: ['习惯', '物品', '开学']
        },
        {
          id: 'd5', date: '腊月过年', weather: '雪',
          body: [
            '过年的时候阿婆的小卖部挂着红灯笼，灯笼边上有流苏，风一吹就晃。',
            '她总爱给串门的小孩子塞块糖，塞完还拍拍孩子的头，说"乖"。'
          ],
          tags: ['过年', '冬天', '习惯']
        }
      ],
      emotions: [],
      connections: [],
      anchors: [
        { id: 'a1', icon: '🍬', title: '那个玻璃糖罐', desc: '放在柜台上，里面永远装着糖', meta: '物品 · 小卖部' },
        { id: 'a2', icon: '🧮', title: '那把老算盘', desc: '噼里啪啦的，算完还要再拨一遍', meta: '物品 · 声音' },
        { id: 'a3', icon: '🪑', title: '有缺口的竹椅', desc: '我小时候磕的，她一直没舍得换', meta: '物品 · 记忆' }
      ]
    },
    {
      id: 'stub-11',
      name: '奶奶',
      details: [
        {
          id: 'd1', date: '七月初三', weather: '晴',
          body: [
            '奶奶缝扣子时，习惯把线在嘴里抿一下，再用拇指搓成尖。',
            '她的顶针戴在右手中指上，磨得发亮，边缘有个小缺口。'
          ],
          tags: ['习惯', '针线', '物品']
        },
        {
          id: 'd2', date: '八月十五', weather: '多云',
          body: [
            '奶奶做月饼，馅总是放得很足，收口的时候要捏十八个褶。',
            '她说是跟太奶奶学的，数错了褶子，月饼就不香了。'
          ],
          tags: ['食物', '手艺', '中秋']
        },
        {
          id: 'd3', date: '九月初九', weather: '雨',
          body: [
            '奶奶的收音机永远开在同一个台，下午两点半准时播评书。',
            '她坐在藤椅上，手里剥着花生，听到精彩处会停下来点点头。'
          ],
          tags: ['习惯', '声音', '雨天']
        },
        {
          id: 'd4', date: '十月初一', weather: '夜',
          body: [
            '奶奶的枕头底下总藏着几块水果糖，是给串门的小孩子准备的。',
            '糖纸都皱了，她自己舍不得吃，说"老人吃甜的牙不好"。'
          ],
          tags: ['物品', '习惯', '夜晚']
        },
        {
          id: 'd5', date: '腊月初八', weather: '雪',
          body: [
            '奶奶熬腊八粥，要放八样东西，一样不能少，一样不能多。',
            '她站在灶台前搅粥，雪花落在窗玻璃上，化了一片又一片。'
          ],
          tags: ['食物', '冬天', '雪']
        }
      ],
      emotions: [],
      connections: [],
      anchors: []
    },
    {
      id: 'stub-12',
      name: '爷爷',
      details: [
        {
          id: 'd1', date: '二月初二', weather: '晴',
          body: [
            '爷爷写毛笔字前，要先磨墨，磨到墨汁挂在砚台边不往下流。',
            '他的毛笔杆上缠了一圈胶布，是笔杆开裂后自己缠的。'
          ],
          tags: ['习惯', '书法', '物品']
        },
        {
          id: 'd2', date: '三月清明', weather: '多云',
          body: [
            '爷爷在院子里种了一排月季，每棵都插着个小竹片做标签。',
            '标签上用铅笔写着花名，字歪歪扭扭的，是他老花眼写的。'
          ],
          tags: ['植物', '院子', '习惯']
        },
        {
          id: 'd3', date: '五月端午', weather: '雨',
          body: [
            '爷爷编竹篮，竹条要先在水里泡三天，说这样才软和不扎手。',
            '他的左手食指上有道疤，是年轻时编竹篮被竹条划的。'
          ],
          tags: ['手艺', '身体', '雨天']
        },
        {
          id: 'd4', date: '七月初七', weather: '夜',
          body: [
            '夏天的晚上，爷爷坐在院子里摇蒲扇，给我讲牛郎织女的故事。',
            '他指星星的时候，手有点抖，说"年纪大了，眼神不好使了"。'
          ],
          tags: ['夜晚', '故事', '夏天']
        },
        {
          id: 'd5', date: '八月中秋', weather: '晴',
          body: [
            '爷爷赏月的时候，总爱在月光下喝一小杯白酒，就着一碟花生。',
            '他的酒杯是个小瓷盅，底儿上有个窑裂，他用了一辈子。'
          ],
          tags: ['习惯', '物品', '中秋']
        }
      ],
      emotions: [],
      connections: [],
      anchors: []
    },
    {
      id: 'stub-13',
      name: '外公',
      details: [
        {
          id: 'd1', date: '正月十五', weather: '晴',
          body: [
            '外公会做兔子灯，竹篾子架骨架，白纸糊身子，红笔画眼睛。',
            '他做的兔子灯，耳朵尖总是有点歪，说是"兔子在听动静"。'
          ],
          tags: ['手艺', '元宵', '物品']
        },
        {
          id: 'd2', date: '四月初八', weather: '多云',
          body: [
            '外公钓鱼，鱼钩上的鱼饵要搓成米粒大小，说"鱼嘴小，太大吞不下"。',
            '他的钓鱼竿是竹子做的，手柄处缠了布条，磨得发毛。'
          ],
          tags: ['习惯', '钓鱼', '物品']
        },
        {
          id: 'd3', date: '六月初六', weather: '雨',
          body: [
            '外公修椅子，一定要用榫卯，不肯用钉子，说"钉子会锈，榫卯不会"。',
            '他的工具箱里有把老刨子，刨刃磨得发亮，是他父亲传给他的。'
          ],
          tags: ['手艺', '工具', '雨天']
        },
        {
          id: 'd4', date: '九月重阳', weather: '晴',
          body: [
            '外公爬山，手里总拄着根拐棍，是他自己在山上砍的荆条。',
            '拐棍的手柄磨得光滑，他说"这拐棍跟了我三十年，比我儿子还亲"。'
          ],
          tags: ['习惯', '物品', '秋天']
        },
        {
          id: 'd5', date: '冬月初一', weather: '雪',
          body: [
            '下雪天，外公在屋里生一盆炭火，上面烤着红薯和柿饼。',
            '他用火钳翻红薯的时候，嘴里会念叨"慢点儿，别烤糊了"。'
          ],
          tags: ['冬天', '雪', '食物']
        }
      ],
      emotions: [],
      connections: [],
      anchors: []
    },
    {
      id: 'stub-14',
      name: '外婆',
      details: [
        {
          id: 'd1', date: '三月初三', weather: '晴',
          body: [
            '外婆采野菜，挎着个竹篮子，篮子上盖着块蓝布，怕菜晒蔫了。',
            '她认得每种野菜的名字，连田埂上最不起眼的小草都能叫出名。'
          ],
          tags: ['食物', '春天', '习惯']
        },
        {
          id: 'd2', date: '五月初五', weather: '多云',
          body: [
            '外婆包粽子，粽叶要煮过再泡一夜，说这样包出来才香。',
            '她包的粽子有四个角，每个角都一样大，像量过似的。'
          ],
          tags: ['食物', '端午', '手艺']
        },
        {
          id: 'd3', date: '七月半', weather: '雨',
          body: [
            '外婆烧纸钱，要一张一张地烧，边烧边念叨着亲人的名字。',
            '她的眼睛不好，烧纸的时候凑得很近，烟把眼睛熏得红红的。'
          ],
          tags: ['习惯', '雨天', '节日']
        },
        {
          id: 'd4', date: '八月半', weather: '夜',
          body: [
            '夏天的晚上，外婆坐在门槛上摇蒲扇，给我唱儿歌。',
            '她的蒲扇是棕榈叶编的，边缘磨破了，用蓝布包了个边。'
          ],
          tags: ['夜晚', '夏天', '物品']
        },
        {
          id: 'd5', date: '腊月廿三', weather: '晴',
          body: [
            '外婆祭灶，灶台上摆着糖瓜和柿饼，还有一小碟清水。',
            '她拜的时候嘴里念念有词，说完还会往灶膛里扔一块糖。'
          ],
          tags: ['习惯', '节日', '冬天']
        }
      ],
      emotions: [],
      connections: [],
      anchors: []
    },
    {
      id: 'stub-15',
      name: '小姑',
      details: [
        {
          id: 'd1', date: '正月初一', weather: '晴',
          body: [
            '小姑每年过年都穿红色的毛衣，说是"本命年要穿红"。',
            '她的毛衣袖口起球了，她会用小剪刀一个一个地剪掉。'
          ],
          tags: ['习惯', '衣物', '过年']
        },
        {
          id: 'd2', date: '二月十四', weather: '多云',
          body: [
            '小姑送礼物，总喜欢自己包装，用彩纸和丝带扎个蝴蝶结。',
            '她的蝴蝶结总是一边大一边小，说"这样才有手工的味道"。'
          ],
          tags: ['习惯', '礼物', '手艺']
        },
        {
          id: 'd3', date: '五月初五', weather: '雨',
          body: [
            '小姑打电话，总要说三遍"再见"才肯挂，说了二十多年。',
            '每次最后一遍"再见"，她的声音都会放软，像是怕对方没听见。'
          ],
          tags: ['习惯', '语言', '雨天']
        },
        {
          id: 'd4', date: '七月初七', weather: '夜',
          body: [
            '小姑聊心事的时候，会下意识地转手上的戒指，转一圈又一圈。',
            '那戒指是银的，样式很简单，是她十八岁生日时自己买的。'
          ],
          tags: ['习惯', '物品', '夜晚']
        },
        {
          id: 'd5', date: '九月初十', weather: '晴',
          body: [
            '小姑带孩子，总爱在孩子的口袋里放一块手帕，叠得整整齐齐。',
            '她说"女孩子要爱干净，手帕是随身带的小太阳"。'
          ],
          tags: ['习惯', '物品', '秋天']
        }
      ],
      emotions: [],
      connections: [],
      anchors: []
    },
    {
      id: 'stub-16',
      name: '舅舅',
      details: [
        {
          id: 'd1', date: '一月初八', weather: '晴',
          body: [
            '舅舅修自行车，总爱在口袋里揣一块抹布，擦完零件擦手。',
            '他的手上有块机油印，洗不掉，说是"修了二十年车的勋章"。'
          ],
          tags: ['手艺', '身体', '习惯']
        },
        {
          id: 'd2', date: '三月十二', weather: '多云',
          body: [
            '舅舅下棋，落子前要把棋子在手里掂三下，再轻轻放下去。',
            '他赢了棋不说话，输了棋也不说话，只是默默把棋子收进盒子。'
          ],
          tags: ['习惯', '下棋', '表情']
        },
        {
          id: 'd3', date: '六月十八', weather: '雨',
          body: [
            '舅舅喝酒，喜欢就着一碟盐水花生，花生要一颗一颗地剥。',
            '他的酒杯是玻璃的，杯底很厚，倒酒的时候总是刚好多出一点点。'
          ],
          tags: ['习惯', '食物', '雨天']
        },
        {
          id: 'd4', date: '八月二十', weather: '夜',
          body: [
            '舅舅看球，看到紧张处会攥紧拳头，指甲嵌进肉里也不觉得疼。',
            '进球了他也不大喊，就是嘴角往上扬一下，又很快收回去。'
          ],
          tags: ['习惯', '表情', '夜晚']
        },
        {
          id: 'd5', date: '十月廿五', weather: '雪',
          body: [
            '下雪天，舅舅会在院子里堆雪人，雪人有个歪歪的鼻子。',
            '他堆雪人的时候，嘴里哼着跑调的歌，自己还不知道跑调了。'
          ],
          tags: ['冬天', '雪', '习惯']
        }
      ],
      emotions: [],
      connections: [],
      anchors: []
    },
    {
      id: 'stub-17',
      name: '阿明',
      details: [
        {
          id: 'd1', date: '三月开学', weather: '晴',
          body: [
            '阿明上学总爱迟到，书包带子永远一边长一边短。',
            '他跑的时候，书包在屁股上一颠一颠的，像装了块石头。'
          ],
          tags: ['习惯', '上学', '物品']
        },
        {
          id: 'd2', date: '五月暑假', weather: '多云',
          body: [
            '阿明摸鱼，总爱在裤腿上蹭两下手上的水，再伸手去抓。',
            '他每次都抓不到，还把裤子弄湿，回家要挨妈妈骂。'
          ],
          tags: ['习惯', '夏天', '游戏']
        },
        {
          id: 'd3', date: '七月盛夏', weather: '雨',
          body: [
            '阿明躲雨，总喜欢站在屋檐下伸出手接雨，接满了再倒掉。',
            '他的鞋总是湿的，因为他总爱故意踩水洼，溅得一裤子都是泥。'
          ],
          tags: ['习惯', '雨天', '游戏']
        },
        {
          id: 'd4', date: '九月秋收', weather: '晴',
          body: [
            '阿明偷枣，爬树的时候总爱往手心吐两口唾沫，再往上爬。',
            '他每次都偷最红的那个，塞在口袋里，回家路上就吃完了。'
          ],
          tags: ['习惯', '秋天', '食物']
        },
        {
          id: 'd5', date: '腊月寒冬', weather: '雪',
          body: [
            '阿明打雪仗，总爱把雪捏得硬硬的，说"这样扔出去才疼"。',
            '他的耳朵冻得通红，也不肯戴帽子，说"戴帽子影响发挥"。'
          ],
          tags: ['冬天', '雪', '游戏']
        }
      ],
      emotions: [],
      connections: [],
      anchors: []
    },
    {
      id: 'stub-18',
      name: '小影',
      details: [
        {
          id: 'd1', date: '四月春风', weather: '晴',
          body: [
            '小影的铅笔盒里总藏着一块橡皮，是草莓形状的，香得发腻。',
            '她不用这块橡皮，只是偶尔拿出来闻一下，又赶紧放回去。'
          ],
          tags: ['物品', '习惯', '春天']
        },
        {
          id: 'd2', date: '六月初夏', weather: '多云',
          body: [
            '小影传纸条，总爱把纸条折成小方块，再在角上画个小爱心。',
            '她递纸条的时候，眼睛不敢看我，耳朵尖红红的。'
          ],
          tags: ['习惯', '物品', '夏天']
        },
        {
          id: 'd3', date: '九月秋雨', weather: '雨',
          body: [
            '小影撑伞，总把伞往我这边歪，自己的半边肩膀都湿了。',
            '她说"我不怕冷"，说完还打了个喷嚏，自己先笑了。'
          ],
          tags: ['雨天', '习惯', '秋天']
        },
        {
          id: 'd4', date: '十一月冬', weather: '夜',
          body: [
            '晚自习的时候，小影总爱把头发别在耳后，露出圆圆的耳朵。',
            '她的发夹是塑料的，透明的，上面有只小小的蝴蝶。'
          ],
          tags: ['夜晚', '物品', '冬天']
        },
        {
          id: 'd5', date: '正月雪天', weather: '雪',
          body: [
            '小影送我的新年礼物，是她自己织的围巾，针脚有松有紧。',
            '她说"第一次织，不好看"，围巾上还沾着几根她的长头发。'
          ],
          tags: ['礼物', '冬天', '雪']
        }
      ],
      emotions: [],
      connections: [],
      anchors: []
    },
    {
      id: 'stub-19',
      name: '陈老师',
      details: [
        {
          id: 'd1', date: '九月开学', weather: '晴',
          body: [
            '陈老师上课，总爱用粉笔头在讲台上敲三下，再开始讲课。',
            '她的粉笔字写得很漂亮，板书总是从黑板的最左边写到最右边。'
          ],
          tags: ['习惯', '上课', '声音']
        },
        {
          id: 'd2', date: '十一月期中', weather: '多云',
          body: [
            '陈老师改作业，喜欢用红笔在旁边写评语，字小小的，很工整。',
            '她改到好的作文，会在后面画个小星星，再画个笑脸。'
          ],
          tags: ['习惯', '工作', '物品']
        },
        {
          id: 'd3', date: '一月期末', weather: '雨',
          body: [
            '陈老师家访，总爱带个笔记本，坐在沙发上认真地记。',
            '她说话的时候，会看着对方的眼睛，偶尔点点头，说"嗯，我知道了"。'
          ],
          tags: ['习惯', '工作', '雨天']
        },
        {
          id: 'd4', date: '三月春游', weather: '晴',
          body: [
            '陈老师带我们春游，包里总装着创可贴和润喉糖，还有一包纸巾。',
            '她走在队伍最后面，怕有人掉队，时不时回头数一下人数。'
          ],
          tags: ['习惯', '春天', '物品']
        },
        {
          id: 'd5', date: '六月毕业', weather: '夜',
          body: [
            '毕业晚会上，陈老师弹着吉他给我们唱歌，她的声音有点抖。',
            '唱到最后一句，她停下来，用手背擦了擦眼睛，说"你们长大了"。'
          ],
          tags: ['夜晚', '毕业', '声音']
        }
      ],
      emotions: [],
      connections: [],
      anchors: []
    },
    {
      id: 'stub-20',
      name: '阿黄',
      details: [
        {
          id: 'd1', date: '三月春风', weather: '晴',
          body: [
            '阿黄第一次来我家，缩在门槛边上，尾巴夹在腿中间，不敢进来。',
            '我递了块馒头给它，它闻了闻，抬头看我，眼睛湿漉漉的。'
          ],
          tags: ['初见', '春天', '食物']
        },
        {
          id: 'd2', date: '五月初夏', weather: '多云',
          body: [
            '阿黄摇尾巴，总是整个屁股都跟着晃，尾巴尖有一撮白毛。',
            '它高兴的时候，会在地上打滚，露出肚子，四条腿朝天蹬。'
          ],
          tags: ['习惯', '夏天', '身体']
        },
        {
          id: 'd3', date: '七月盛夏', weather: '雨',
          body: [
            '下雨的时候，阿黄总爱趴在门口，耳朵竖着，听外面的雨声。',
            '它的爪子湿了，会在门槛上蹭两下，再走进屋里。'
          ],
          tags: ['雨天', '习惯', '夏天']
        },
        {
          id: 'd4', date: '九月秋凉', weather: '晴',
          body: [
            '阿黄散步的时候，总爱走在我前面一点，走几步就回头看看我。',
            '它遇到别的狗，会停下来闻闻对方，然后摇摇尾巴继续走。'
          ],
          tags: ['习惯', '秋天', '散步']
        },
        {
          id: 'd5', date: '腊月寒冬', weather: '雪',
          body: [
            '下雪天，阿黄喜欢在雪地里踩脚印，踩一下就低头闻闻。',
            '它的鼻子冻得凉凉的，凑过来蹭我的手，像一块小冰块。'
          ],
          tags: ['冬天', '雪', '习惯']
        }
      ],
      emotions: [],
      connections: [],
      anchors: []
    }
  ];

  // ── 工具函数 ──
  function uid() {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ── 数据存储 ──
  function loadAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function saveAll(stubs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stubs));
  }

  function initIfEmpty() {
    if (!loadAll()) {
      saveAll(deepClone(SEED_DATA));
    }
  }

  // ── 存根簿 CRUD ──
  function listStubs() {
    initIfEmpty();
    return loadAll();
  }

  function getStub(stubId) {
    var stubs = listStubs();
    for (var i = 0; i < stubs.length; i++) {
      if (stubs[i].id === stubId) return stubs[i];
    }
    return null;
  }

  function getActiveStubId() {
    var id = localStorage.getItem(ACTIVE_KEY);
    if (!id) {
      var stubs = listStubs();
      id = stubs.length ? stubs[0].id : null;
    }
    return id;
  }

  function setActiveStubId(id) {
    localStorage.setItem(ACTIVE_KEY, id);
  }

  function createStub(name) {
    var stubs = listStubs();
    var stub = { id: uid(), name: name, details: [], emotions: [], connections: [], anchors: [] };
    stubs.push(stub);
    saveAll(stubs);
    return stub;
  }

  function updateStubName(stubId, name) {
    var stubs = listStubs();
    for (var i = 0; i < stubs.length; i++) {
      if (stubs[i].id === stubId) { stubs[i].name = name; break; }
    }
    saveAll(stubs);
  }

  function deleteStub(stubId) {
    var stubs = listStubs();
    stubs = stubs.filter(function (s) { return s.id !== stubId; });
    saveAll(stubs);
    if (getActiveStubId() === stubId) {
      setActiveStubId(stubs.length ? stubs[0].id : '');
    }
  }

  // ── 条目 CRUD（通用） ──
  function getEntries(stubId, section) {
    var stub = getStub(stubId);
    return stub ? (stub[section] || []) : [];
  }

  function addEntry(stubId, section, entry) {
    var stubs = listStubs();
    for (var i = 0; i < stubs.length; i++) {
      if (stubs[i].id === stubId) {
        entry.id = uid();
        stubs[i][section].push(entry);
        break;
      }
    }
    saveAll(stubs);
    return entry;
  }

  function updateEntry(stubId, section, entryId, data) {
    var stubs = listStubs();
    for (var i = 0; i < stubs.length; i++) {
      if (stubs[i].id === stubId) {
        var items = stubs[i][section];
        for (var j = 0; j < items.length; j++) {
          if (items[j].id === entryId) {
            for (var k in data) { if (data.hasOwnProperty(k)) items[j][k] = data[k]; }
            break;
          }
        }
        break;
      }
    }
    saveAll(stubs);
  }

  function deleteEntry(stubId, section, entryId) {
    var stubs = listStubs();
    for (var i = 0; i < stubs.length; i++) {
      if (stubs[i].id === stubId) {
        stubs[i][section] = stubs[i][section].filter(function (e) { return e.id !== entryId; });
        break;
      }
    }
    saveAll(stubs);
  }

  // ── 重置为示例数据 ──
  function resetToSeed() {
    saveAll(deepClone(SEED_DATA));
    localStorage.removeItem(ACTIVE_KEY);
  }

  // ── 导出 ──
  global.LifeStub = {
    listStubs: listStubs,
    getStub: getStub,
    getActiveStubId: getActiveStubId,
    setActiveStubId: setActiveStubId,
    createStub: createStub,
    updateStubName: updateStubName,
    deleteStub: deleteStub,
    getEntries: getEntries,
    addEntry: addEntry,
    updateEntry: updateEntry,
    deleteEntry: deleteEntry,
    resetToSeed: resetToSeed,
    uid: uid
  };
})(window);
