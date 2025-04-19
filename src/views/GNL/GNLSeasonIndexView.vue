<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed, onMounted } from "vue";
import { teamGnlIndexBanner, useGNLStore } from "@/stores/gnl";
import { Race } from "@/stores/races";
import VueCountdown from "@chenfengyuan/vue-countdown";

import gnl_logo from "@/assets/gnl/logo.png";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const router = useRouter();
const store = useGNLStore();

const current = {
  id: uuidv4(),
  created: moment().toDate(),
  updated: moment().toDate(),
  season: 16,
  start: "14.04.2025",
  end: "09.06.2025",
  teams: [
    {
      id: "tttg",
      name: "Thrall's Thundershock Therapy Group",
      prefix: "",
      coaches: [
        {
          battleTag: "ikbencool#2603",
          race: Race.Human,
          races: [Race.Human],
          roles: ["Coach"],
          quotes: [],
        },
        {
          battleTag: "EAShibby#2644",
          race: Race.Random,
          races: [Race.Random],
          roles: ["Coach"],
          quotes: [],
        },
        {
          battleTag: "Slayday#11794",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach"],
          quotes: [],
        },
      ],
      players: [
        {
          battleTag: "GonzoTramer#2346",
          race: 8,
        },
        {
          battleTag: "Longjacket#2840",
          race: 1,
        },
        {
          battleTag: "Madoka12#1159",
          race: 1,
        },
        {
          battleTag: "fourthAge#1445",
          race: 2,
        },
        {
          battleTag: "LinYuRong101#1714",
          race: 1,
        },
        {
          battleTag: "Curunir#21273",
          race: 1,
        },
        {
          battleTag: "HungryDrake#1134",
          race: 4,
        },
        {
          battleTag: "Anees#1492",
          race: 8,
        },
        {
          battleTag: "skitzo1990#2881",
          race: 4,
        },
        {
          battleTag: "miman7#21459",
          race: 1,
        },
        {
          battleTag: "Breezeey3#1541",
          race: 2,
        },
        {
          battleTag: "Teage#2434",
          race: 4,
        },
        {
          battleTag: "waylander#2826",
          race: 0,
        },
        {
          battleTag: "EpicGamer#12218",
          race: 2,
        },
        {
          battleTag: "JacK#24678",
          race: 1,
        },
        {
          battleTag: "Aeris#21667",
          race: 1,
        },
        {
          battleTag: "Feint#21145",
          race: 4,
        },
        {
          battleTag: "dexon#21405",
          race: 1,
        },
        {
          battleTag: "Gruumsh#11529",
          race: 8,
        },
        {
          battleTag: "LonelyCat#2757",
          race: 2,
        },
        {
          battleTag: "Minkz#21749",
          race: 1,
        },
        {
          battleTag: "eXample#2533",
          race: 2,
        },
        {
          battleTag: "Sabesaroo#2133",
          race: 4,
        },
        {
          battleTag: "Smaug#2270",
          race: 1,
        },
        {
          battleTag: "Eisen#11506",
          race: 2,
        },
        {
          battleTag: "Cloning5#2785",
          race: 4,
        },
        {
          battleTag: "Nameth#2655",
          race: 8,
        },
        {
          battleTag: "Azeel#21653",
          race: 1,
        },
        {
          battleTag: "KayJay#21512",
          race: 2,
        },
        {
          battleTag: "Swami#12912",
          race: 8,
        },
        {
          battleTag: "LeadFace#1530",
          race: 1,
        },
        {
          battleTag: "Shlumples#1394",
          race: 2,
        },
        {
          battleTag: "Serster#2788",
          race: 4,
        },
      ],
    },
    {
      id: "panda",
      name: "Chinese Panda",
      prefix: "",
      coaches: [
        {
          battleTag: "RobotNinja#2136641",
          race: Race.Human,
          races: [Race.Human],
          roles: ["Coach"],
          quotes: [],
        },
        {
          battleTag: "Thaedalius#1362",
          race: Race.Orc,
          races: [Race.Orc],
          roles: ["Coach"],
          quotes: [],
        },
      ],
      players: [
        {
          battleTag: "BABYMETAL#21291",
          race: 4,
        },
        {
          battleTag: "Klaasje#11420",
          race: 2,
        },
        {
          battleTag: "Remote#21761",
          race: 1,
        },
        {
          battleTag: "Loneshark#11407",
          race: 8,
        },
        {
          battleTag: "drawkao#2342",
          race: 0,
        },
        {
          battleTag: "Kaccel#2863",
          race: 1,
        },
        {
          battleTag: "floss2xdaily#1987",
          race: 1,
        },
        {
          battleTag: "noizer#2444",
          race: 2,
        },
        {
          battleTag: "SoftIceCream#11120",
          race: 1,
        },
        {
          battleTag: "ThreeWayKay#2610",
          race: 1,
        },
        {
          battleTag: "Crutio#11420",
          race: 2,
        },
        {
          battleTag: "Lavaogre#18463",
          race: 8,
        },
        {
          battleTag: "Galaxy#6946",
          race: 8,
        },
        {
          battleTag: "Prutrok#2387",
          race: 2,
        },
        {
          battleTag: "Sellian#11543",
          race: 2,
        },
        {
          battleTag: "biskuit#21557",
          race: 1,
        },
        {
          battleTag: "AlumniSCV#1673",
          race: 1,
        },
        {
          battleTag: "Arcane#22951",
          race: 1,
        },
        {
          battleTag: "Apezap#1478",
          race: 2,
        },
        {
          battleTag: "Havi#21292",
          race: 2,
        },
        {
          battleTag: "SillyGoose#12773",
          race: 2,
        },
        {
          battleTag: "SpicyNoodle#11249",
          race: 4,
        },
        {
          battleTag: "TryHarder#11436",
          race: 4,
        },
        {
          battleTag: "cheese#11485",
          race: 2,
        },
        {
          battleTag: "Riegel#2724",
          race: 8,
        },
        {
          battleTag: "Stormwhiler#2805",
          race: 2,
        },
        {
          battleTag: "Zuhier#2275",
          race: 8,
        },
        {
          battleTag: "CareAgain#11774",
          race: 1,
        },
        {
          battleTag: "Bandlez#1752",
          race: 2,
        },
        {
          battleTag: "morcovia#2692",
          race: 1,
        },
        {
          battleTag: "OverlordDavi#1926",
          race: 1,
        },
        {
          battleTag: "Lorch#1248",
          race: 2,
        },
      ],
    },
    {
      id: "fiends",
      name: "Fiends with Benefits",
      prefix: "",
      coaches: [
        {
          battleTag: "EchoGoodman#2734",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach"],
          quotes: [],
        },
        {
          battleTag: "veS#1614",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach"],
          quotes: [],
        },
        {
          battleTag: "KaGeMaN#1160",
          race: Race.NightElf,
          races: [Race.NightElf],
          roles: ["Coach"],
          quotes: [],
        },
      ],
      players: [
        {
          battleTag: "TTVcriticism#2867",
          race: 0,
        },
        {
          battleTag: "Glarer#21552",
          race: 8,
        },
        {
          battleTag: "Palec#21700",
          race: 8,
        },
        {
          battleTag: "Mrmikemtl#1698",
          race: 2,
        },
        {
          battleTag: "WarDanCa#2752",
          race: 1,
        },
        {
          battleTag: "Heresy#21250",
          race: 2,
        },
        {
          battleTag: "Zinithin#1702",
          race: 8,
        },
        {
          battleTag: "Kageman#1160",
          race: 4,
        },
        {
          battleTag: "Wizzer#11863",
          race: 1,
        },
        {
          battleTag: "Exiled#21153",
          race: 8,
        },
        {
          battleTag: "Bandelero#11787",
          race: 4,
        },
        {
          battleTag: "Khinhazzard#1982",
          race: 8,
        },
        {
          battleTag: "Ordos#2923",
          race: 1,
        },
        {
          battleTag: "HappyDay#21765",
          race: 1,
        },
        {
          battleTag: "AFSTERXD#2469",
          race: 2,
        },
        {
          battleTag: "Quppi#1964",
          race: 4,
        },
        {
          battleTag: "joolz#1133",
          race: 8,
        },
        {
          battleTag: "ceilingchair#11171",
          race: 2,
        },
        {
          battleTag: "Ghostfrosti#21132",
          race: 1,
        },
        {
          battleTag: "Fila#11367",
          race: 8,
        },
        {
          battleTag: "Ejbinator#2529",
          race: 2,
        },
        {
          battleTag: "googlypoo#1669",
          race: 8,
        },
        {
          battleTag: "AoW#21555",
          race: 2,
        },
        {
          battleTag: "Rolia#1430",
          race: 4,
        },
        {
          battleTag: "Havoc#13211",
          race: 8,
        },
        {
          battleTag: "jACOB#21633",
          race: 2,
        },
        {
          battleTag: "Marvul#1393",
          race: 4,
        },
        {
          battleTag: "Meanman#1140",
          race: 1,
        },
        {
          battleTag: "Arkadecoin#1732",
          race: 8,
        },
        {
          battleTag: "JDR#11357",
          race: 2,
        },
        {
          battleTag: "Licious#2234",
          race: 8,
        },
        {
          battleTag: "Numper#21886",
          race: 8,
        },
      ],
    },
    {
      id: "cok",
      name: "Clutch or Kick",
      prefix: "",
      coaches: [
        {
          battleTag: "Anár#1939",
          race: Race.NightElf,
          races: [Race.NightElf],
          roles: ["Coach"],
          quotes: [],
        },
        {
          battleTag: "carsoNNN#1657",
          race: Race.Orc,
          races: [Race.Orc],
          roles: ["Coach"],
          quotes: [],
        },
      ],
      players: [
        {
          battleTag: "Cenotaph#11854",
          race: 4,
        },
        {
          battleTag: "lucker#11299",
          race: 2,
        },
        {
          battleTag: "AllSupTTV#2359",
          race: 4,
        },
        {
          battleTag: "Vigen#2540",
          race: 4,
        },
        {
          battleTag: "Blavon#21745",
          race: 0,
        },
        {
          battleTag: "Tarmok#2559",
          race: 2,
        },
        {
          battleTag: "Insane#23331",
          race: 8,
        },
        {
          battleTag: "SPXQuywiX#1201",
          race: 0,
        },
        {
          battleTag: "infy#2714",
          race: 2,
        },
        {
          battleTag: "Kikuxd#1357",
          race: 1,
        },
        {
          battleTag: "Merlin#24803",
          race: 4,
        },
        {
          battleTag: "Paintherisen#1700",
          race: 4,
        },
        {
          battleTag: "Falcao9#1111",
          race: 8,
        },
        {
          battleTag: "thodoris254#1264",
          race: 1,
        },
        {
          battleTag: "Xilsy#1994",
          race: 4,
        },
        {
          battleTag: "Greydone#21359",
          race: 2,
        },
        {
          battleTag: "DGraves#11954",
          race: 8,
        },
        {
          battleTag: "MrJelly#1221",
          race: 8,
        },
        {
          battleTag: "deda#2794",
          race: 4,
        },
        {
          battleTag: "Zacron#11846",
          race: 8,
        },
        {
          battleTag: "Klaudius#21484",
          race: 1,
        },
        {
          battleTag: "tarpman#1995",
          race: 8,
        },
        {
          battleTag: "Firas#21991",
          race: 8,
        },
        {
          battleTag: "Orex#1653",
          race: 2,
        },
        {
          battleTag: "QcDarkfaire#1196",
          race: 2,
        },
        {
          battleTag: "Quaeq#2243",
          race: 2,
        },
        {
          battleTag: "ChairmanFan#1970",
          race: 8,
        },
        {
          battleTag: "DrGonzo#2269",
          race: 8,
        },
        {
          battleTag: "Memnon#11608",
          race: 2,
        },
        {
          battleTag: "brónntag#1716",
          race: 0,
        },
        {
          battleTag: "Siglinde#2864",
          race: 4,
        },
        {
          battleTag: "ToriKaraage#2339",
          race: 8,
        },
        {
          battleTag: "Abyezyana#2778",
          race: 1,
        },
      ],
    },
    {
      id: "pitty",
      name: "Pitty Party",
      prefix: "",
      coaches: [
        {
          battleTag: "Fattsrussell",
          race: Race.Random,
          races: [Race.Random],
          roles: ["Coach"],
          quotes: [],
        },
        {
          battleTag: "OldGreg#11862",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach"],
          quotes: [],
        },
        {
          battleTag: "quadgfan#1418",
          race: Race.Orc,
          races: [Race.Orc],
          roles: ["Coach"],
          quotes: [],
        },
      ],
      players: [
        {
          battleTag: "OldGreg#11862",
          race: 8,
        },
        {
          battleTag: "doctajones#11327",
          race: 4,
        },
        {
          battleTag: "TLebbet#2684",
          race: 2,
        },
        {
          battleTag: "jojoboss#1794",
          race: 1,
        },
        {
          battleTag: "quadgfan#1418",
          race: 2,
        },
        {
          battleTag: "nudal#2520",
          race: 1,
        },
        {
          battleTag: "Disproved#21742",
          race: 4,
        },
        {
          battleTag: "eworm#21209",
          race: 8,
        },
        {
          battleTag: "o11ec#1558",
          race: 8,
        },
        {
          battleTag: "SOULKEEPA#21303",
          race: 2,
        },
        {
          battleTag: "Elffy#11444",
          race: 4,
        },
        {
          battleTag: "Alexander#211980",
          race: 4,
        },
        {
          battleTag: "LeroyJenkins#2212",
          race: 4,
        },
        {
          battleTag: "elravel#2772",
          race: 2,
        },
        {
          battleTag: "Gojira#2397",
          race: 8,
        },
        {
          battleTag: "SquidVicious#11899",
          race: 4,
        },
        {
          battleTag: "GoAgainGreg#1554",
          race: 2,
        },
        {
          battleTag: "nugsnapper#1536",
          race: 1,
        },
        {
          battleTag: "Chino#1152",
          race: 4,
        },
        {
          battleTag: "Ceryni#1376",
          race: 0,
        },
        {
          battleTag: "KagolinX#2117",
          race: 1,
        },
        {
          battleTag: "lodolama#2985",
          race: 4,
        },
        {
          battleTag: "FalleN#2647",
          race: 2,
        },
        {
          battleTag: "coldstorm05#1823",
          race: 8,
        },
        {
          battleTag: "thehitpack#2432",
          race: 8,
        },
        {
          battleTag: "Winwake#2314",
          race: 1,
        },
        {
          battleTag: "Dock#21848",
          race: 1,
        },
        {
          battleTag: "Lion#33684",
          race: 2,
        },
        {
          battleTag: "DrLinguine#1141",
          race: 4,
        },
        {
          battleTag: "SILL#21367",
          race: 2,
        },
        {
          battleTag: "CerebralPaul#11961",
          race: 4,
        },
        {
          battleTag: "smitejr#1114",
          race: 2,
        },
        {
          battleTag: "UrMotherMom#1580",
          race: 4,
        },
      ],
    },
    {
      id: "apelords",
      name: "Apelords",
      prefix: "Mr.",
      coaches: [
        {
          battleTag: "SaulApeMan#2163",
          race: Race.Random,
          races: [Race.Human, Race.Undead, Race.Orc, Race.NightElf],
          roles: ["Caster", "Coach", "Ape"],
          quotes: [
            "Makrura for you!",
            "Ladies and Gentlemen, welcome to GNL!",
            "Have you seen the size of my EXCEL SHEETS?",
          ],
        },
        {
          battleTag: "spycreed#2536",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach", "Gabagool"],
          quotes: ["It's-a Me, Spycreed!"],
        },
      ],
      players: [
        {
          battleTag: "Positrone#2577",
          race: 2,
        },
        {
          battleTag: "noMADic#11242",
          race: 1,
        },
        {
          battleTag: "CakeOrRiot#2221",
          race: 8,
        },
        {
          battleTag: "jsr#21478",
          race: 1,
        },
        {
          battleTag: "StrsNStripes#1943",
          race: 8,
        },
        {
          battleTag: "ThaGrinchy31#1490",
          race: 4,
        },
        {
          battleTag: "Zanatas#11745",
          race: 8,
        },
        {
          battleTag: "AntiLucker#2301",
          race: 2,
        },
        {
          battleTag: "Zadiraka#21825",
          race: 4,
        },
        {
          battleTag: "Nether#11344",
          race: 1,
        },
        {
          battleTag: "Zenox#2801",
          race: 1,
        },
        {
          battleTag: "Dekker#2290",
          race: 8,
        },
        {
          battleTag: "abgee#1681",
          race: 4,
        },
        {
          battleTag: "Tacoshell#1753",
          race: 2,
        },
        {
          battleTag: "soyeon#1627",
          race: 4,
        },
        {
          battleTag: "ShiiQ#2180",
          race: 2,
        },
        {
          battleTag: "FLick#1847",
          race: 8,
        },
        {
          battleTag: "Doom#23869",
          race: 8,
        },
        {
          battleTag: "STuckED#11829",
          race: 1,
        },
        {
          battleTag: "BitBoy#21468",
          race: 1,
        },
        {
          battleTag: "DerMave#2965",
          race: 8,
        },
        {
          battleTag: "DurianLord#1592",
          race: 1,
        },
        {
          battleTag: "Spike#13207",
          race: 2,
        },
        {
          battleTag: "phi#1210",
          race: 0,
        },
        {
          battleTag: "hubermensch#1352",
          race: 2,
        },
        {
          battleTag: "Westii#21756",
          race: 8,
        },
        {
          battleTag: "Diibu#2593",
          race: 4,
        },
        {
          battleTag: "Amnion#1137",
          race: 2,
        },
        {
          battleTag: "SmoothEEL#2396",
          race: 2,
        },
        {
          battleTag: "SHORYUKEN#11312",
          race: 8,
        },
        {
          battleTag: "Protz#2814",
          race: 8,
        },
        {
          battleTag: "ForestSpirit#11498",
          race: 4,
        },
        {
          battleTag: "Quantum#1676",
          race: 2,
        },
      ],
    },
    {
      id: "gigglinggoblins",
      name: "Giggling Goblins",
      prefix: "",
      coaches: [
        {
          battleTag: "NorthDrakkar#1745",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach", "Buglover #1", "120 Fanboy"],
          quotes: ["Look! I found a cryptlord first game!"],
        },
        {
          battleTag: "RaZeR#23389",
          race: Race.Orc,
          races: [Race.Orc],
          roles: ["Coach"],
        },
      ],
      players: [
        {
          battleTag: "DwieTwarze#2534",
          race: 4,
        },
        {
          battleTag: "Supa#2123",
          race: 2,
        },
        {
          battleTag: "Fluxior#2518",
          race: 2,
        },
        {
          battleTag: "Shew#1211",
          race: 4,
        },
        {
          battleTag: "Superrman#2941",
          race: 1,
        },
        {
          battleTag: "Makaveli#2949",
          race: 2,
        },
        {
          battleTag: "jer#1795",
          race: 2,
        },
        {
          battleTag: "Ares#11947",
          race: 1,
        },
        {
          battleTag: "Meftly#2917",
          race: 1,
        },
        {
          battleTag: "Infernokoi#2778",
          race: 8,
        },
        {
          battleTag: "RedSonja#21938",
          race: 4,
        },
        {
          battleTag: "Scytherr#2230",
          race: 4,
        },
        {
          battleTag: "SimpleStyle#1183",
          race: 1,
        },
        {
          battleTag: "Lunarsong#2613",
          race: 4,
        },
        {
          battleTag: "Rezun#2876",
          race: 8,
        },
        {
          battleTag: "EternalRMG#1746",
          race: 1,
        },
        {
          battleTag: "Sizofren#2973",
          race: 2,
        },
        {
          battleTag: "Warlock#13480",
          race: 4,
        },
        {
          battleTag: "Kilop#2935",
          race: 8,
        },
        {
          battleTag: "Duda#1121",
          race: 8,
        },
        {
          battleTag: "MasaCom#3609",
          race: 4,
        },
        {
          battleTag: "Tensai#31896",
          race: 2,
        },
        {
          battleTag: "Milka#2692",
          race: 2,
        },
        {
          battleTag: "Blackprisme#2713",
          race: 2,
        },
        {
          battleTag: "LukCoo#1515",
          race: 2,
        },
        {
          battleTag: "Azerthas#2362",
          race: 8,
        },
        {
          battleTag: "SoulsDestiny#2658",
          race: 2,
        },
        {
          battleTag: "GMoses#1744",
          race: 8,
        },
        {
          battleTag: "Reklewt#11776",
          race: 4,
        },
        {
          battleTag: "Shnoobins#2243",
          race: 8,
        },
        {
          battleTag: "Crispjank#2989",
          race: 2,
        },
        {
          battleTag: "Bulimah#1808",
          race: 8,
        },
      ],
    },
    {
      id: "gnlbears",
      name: "GNL Bears",
      prefix: "",
      coaches: [
        {
          battleTag: "React#21633",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach", "Lawyer"],
          quotes: ["Focus Pocus!", "Hotpot"],
        },
        {
          battleTag: "ChelseaFC#21447",
          race: Race.Orc,
          races: [Race.Orc],
          roles: [],
          quotes: [],
        },
        {
          battleTag: "jolin#31419",
          race: Race.NightElf,
          races: [Race.NightElf],
          roles: ["Coach", "Jabba"],
          quotes: [
            "Who here?",
            "<Donut.jpg>",
            "Jabba will teach u chinese paladin",
          ],
        },
      ],
      players: [
        {
          battleTag: "Zeggsy#21588",
          race: 8,
        },
        {
          battleTag: "ZhenNai#2155",
          race: 4,
        },
        {
          battleTag: "ProstT#2556",
          race: 2,
        },
        {
          battleTag: "Halleluwah#11136",
          race: 2,
        },
        {
          battleTag: "Chadlord#3654",
          race: 8,
        },
        {
          battleTag: "ЖИВОТНОЕ#21901",
          race: 8,
        },
        {
          battleTag: "Waschbaer#2330",
          race: 4,
        },
        {
          battleTag: "Manadog#1752",
          race: 1,
        },
        {
          battleTag: "Fasez#2587",
          race: 2,
        },
        {
          battleTag: "Boogar#2246",
          race: 2,
        },
        {
          battleTag: "icecat#11771",
          race: 8,
        },
        {
          battleTag: "Fury#23852",
          race: 2,
        },
        {
          battleTag: "Greeny#22662",
          race: 2,
        },
        {
          battleTag: "Sectumsempra#21169",
          race: 8,
        },
        {
          battleTag: "Munsoon#2468",
          race: 1,
        },
        {
          battleTag: "Bulldog#1458",
          race: 1,
        },
        {
          battleTag: "SHreddedWInd#11318",
          race: 8,
        },
        {
          battleTag: "Loddarious#2388",
          race: 2,
        },
        {
          battleTag: "Discopandan#2172",
          race: 8,
        },
        {
          battleTag: "moonbeam#2200",
          race: 4,
        },
        {
          battleTag: "Hyx#21886",
          race: 1,
        },
        {
          battleTag: "D3n1eD#2451",
          race: 4,
        },
        {
          battleTag: "Xeroxxfox#1892",
          race: 8,
        },
        {
          battleTag: "BYDmitriy#2851",
          race: 2,
        },
        {
          battleTag: "Daedelus#11820",
          race: 4,
        },
        {
          battleTag: "Siflou#1897",
          race: 8,
        },
        {
          battleTag: "SilentYoda#1888",
          race: 2,
        },
        {
          battleTag: "DaSkettiYeti#1427",
          race: 8,
        },
        {
          battleTag: "raynor88#1984",
          race: 1,
        },
        {
          battleTag: "HoppyBrewer#1136",
          race: 2,
        },
        {
          battleTag: "Vermin#11617",
          race: 8,
        },
        {
          battleTag: "Savior#11574",
          race: 4,
        },
        {
          battleTag: "Celior#2986",
          race: 2,
        },
      ],
    },
  ],
};

// Chart stuff
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  Tooltip,
  LineController,
} from "chart.js";
import "chartjs-adapter-moment";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { v4 as uuidv4 } from "uuid";
import moment from "moment/moment";
import { useRouter } from "vue-router";
import _round from "lodash/round";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import _range from "lodash/range";
import _isEmpty from "lodash/isEmpty";
import _take from "lodash/take";
import _skip from "lodash/drop";
import GNLCoachBanner from "@/components/gnl/GNLCoachBanner.vue";
import GNLPlayerBanner from "@/components/gnl/GNLPlayerBanner.vue";
import _capitalize from "lodash/capitalize";
import _first from "lodash/first";

ChartJS.register(
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  ChartDataLabels,
);

const options = computed<any>(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        type: "category",
        stacked: true,
      },
      y: {
        grid: { display: false },
        min: 0,
        suggestedMax: Math.max(...points.value) * 1.2,
      },
    },
  };
});
// End

const points = computed(() => {
  if (_isEmpty(store.data?.teams)) {
    return [];
  }
  return store.data.teams.map((t: any) => {
    return t.players?.reduce((s: number, p: any) => {
      return s + (p.totalPoints ?? 0);
    }, 0);
  });
});

const games = computed(() => {
  if (_isEmpty(store.data?.teams)) {
    return [];
  }
  return store.data.teams.map((t: any) => {
    return t.players?.reduce((s: number, p: any) => {
      return s + (p.data?.total ?? 0);
    }, 0);
  });
});

const leader = computed(() => {
  const i = points.value.indexOf(Math.max(...points.value));
  return i > 0 ? store.data?.teams?.[i] : {};
});

const winnerId = "gigglinggoblins";
const winner = computed(() => {
  return store.data?.teams?.find((t: any) => t.id === winnerId);
});

const players = computed(() => {
  if (_isEmpty(store.data?.teams)) {
    return [];
  }
  return store.data.teams
    .reduce((s: any[], t: any) => {
      return [...s, ...t.players];
    }, [])
    .sort((a: any, b: any) => b.totalPoints - a.totalPoints);
});

// Text
const model = defineModel<string>({
  default: `
  # Information about the page
  This page is a support tool to help motivate all the GNL participants and teams to practice on the [w3c ladder](https://w3champions.com/) in between official GNL games.
  If you are on a team, you can contribute to make sure that **your** team wins the GNL Ladder race!

  Every win on the ladder awards **3** points, and every loss awards **1** point for the team that you represent. __Regardless of MMR__

  This overview page shows the current total ladder points for each team, with the current leader - and the individual team pages show both information
  about coaches and players! You can access the team pages in the menu on the left or by clicking the team icon above!

  Can you help your team win the ladder race? Are you the one to claim ladder RANK #1 on your team?
  Why delay? Go search for a ladder game right now and find out!
  `,
});

onMounted(() => {
  store.initialize();
});
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 1">
      <v-btn v-if="false" color="success" @click="() => store.save(current)"
        >SAVE</v-btn
      >
      <v-sheet
        v-if="_isEmpty(store.data)"
        class="pa-md-12 pa-3"
        elevation="10"
        transition="fade-transition"
        style="min-height: 90vh">
        <v-row>
          <v-col cols="12" class="text-center">
            >
            <div class="text-md-h2 text-h5 d-flex align-center justify-center">
              <img
                class="mr-auto"
                alt="Gym Newbie League!"
                :src="gnl_logo"
                height="100" />
              <span>GNL Season {{ store.data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary">Overview</span>
            </div>
            <hr />
          </v-col>
        </v-row>

        <v-row class="text-center">
          <v-col cols="12">
            <v-row>
              <v-col cols="3" v-for="_ in _range(0, 8)">
                <v-skeleton-loader type="image" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-skeleton-loader type="image" height="100" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-divider className="my-2" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader type="image" height="150" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader type="paragraph" />
          </v-col>
        </v-row>
      </v-sheet>

      <v-sheet
        v-else
        class="pa-md-12 pa-3"
        elevation="10"
        transition="fade-transition"
        style="min-height: 90vh">
        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-md-h2 text-h5 d-flex align-center justify-center">
              <img
                v-if="!$vuetify.display.mobile"
                class="mr-auto"
                alt="Gym Newbiew League!"
                :src="gnl_logo"
                height="100" />
              <span>GNL Season {{ store.data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary mr-auto">Overview</span>
            </div>
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col cols="12">
            <v-row>
              <v-col
                v-for="team in store.data?.teams ?? []"
                cols="12"
                sm="6"
                md="3">
                <v-card
                  :class="`team ${leader?.id === team.id ? 'gold' : ''}`"
                  @click="() => router.push(`/gnl/${team.id}`)">
                  <v-img
                    :aspect-ratio="1"
                    :src="teamGnlIndexBanner(team.id)"
                    class="align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="225px"
                    cover>
                    <v-card-title>
                      <span
                        :style="{
                          verticalAlign: 'middle',
                          color: leader?.id === team.id ? 'yellow' : 'white',
                        }">
                        <v-icon
                          v-if="leader?.id === team.id"
                          icon="mdi-trophy"
                          class="ml-1" />
                        {{ team.name }}
                      </span>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <Bar
              height="250px"
              :data="{
                labels: _isEmpty(store.data.teams)
                  ? []
                  : store.data.teams?.map((t: any) =>
                      $vuetify.display.mobile && t.name.length > 10
                        ? `${t.name.substring(0, 10)}...`
                        : t.name,
                    ),
                datasets: [
                  {
                    label: 'points',
                    backgroundColor: 'rgba(218, 165, 32, 0.3)',
                    borderColor: 'goldenrod',
                    borderWidth: 2,
                    barPercentage: 0.5,
                    data: points,
                    datalabels: {
                      clip: true,
                      clamp: true,
                      anchor: 'end',
                      align: 'end',
                      offset: 0,
                      color: 'goldenrod',
                    },
                  },
                  {
                    label: 'games',
                    backgroundColor: 'rgba(218, 165, 32, 0.4)',
                    borderColor: 'goldenrod',
                    borderWidth: 2,
                    barPercentage: 0.5,
                    data: games,
                    datalabels: {
                      clip: true,
                      clamp: true,
                      anchor: 'end',
                      align: 'end',
                      offset: 0,
                      color: 'goldenrod',
                    },
                  },
                ],
              }"
              :options="options" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-divider />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            class="text-center text-h6 text-uppercase d-flex align-center"
            ><span class="text-h4 text-green-accent-3 ml-auto mr-2">{{
              games.reduce((r: number, s: number) => r + s, 0)
            }}</span>
            <span v-if="store.dates.timeRemaining > 0" class="mr-auto"
              >GNL Ladder Games Played So Far!</span
            >
            <span v-else class="mr-auto"
              >GNL Ladder Games Were Played This Season!</span
            >
          </v-col></v-row
        >
        <v-row>
          <v-col
            cols="12"
            class="d-flex align-center"
            v-if="store.dates.timeRemaining > 0">
            <v-icon icon="mdi-run" size="x-large" />
            <span
              class="font-weight-bold"
              style="
                width: 0;
                height: 0;
                position: relative;
                top: 30px;
                right: 50px;
              ">
              {{ store.dates.start.format("DD.MM.YYYY") }}
            </span>
            <v-progress-linear
              striped
              style="border: 1px solid gray"
              :color="
                store.dates.durationInDays - (store.dates.daysSinceStart - 1) <=
                0
                  ? 'success'
                  : 'warning'
              "
              :model-value="store.dates.daysSinceStart - 1"
              :max="store.dates.durationInDays"
              :height="45">
              <strong v-if="store.dates.daysSinceStart >= 0"
                >{{
                  Math.max(
                    0,
                    _round(
                      ((store.dates.daysSinceStart - 1) /
                        store.dates.durationInDays) *
                        100,
                    ),
                  )
                }}%</strong
              >
            </v-progress-linear>
            <v-icon icon="mdi-exit-run" size="x-large" />
            <v-icon icon="mdi-flag-checkered" size="x-large" />
            <span
              class="font-weight-bold"
              style="
                width: 0;
                height: 0;
                position: relative;
                top: 30px;
                right: 75px;
              ">
              {{ store.dates.end.format("DD.MM.YYYY") }}
            </span>
          </v-col>
          <v-icon
            v-if="
              (store.dates.daysSinceStart - 1) / store.dates.durationInDays >
                0.01 &&
              (store.dates.daysSinceStart - 1) / store.dates.durationInDays <
                0.9
            "
            icon="mdi-run-fast"
            color="warning"
            size="x-large"
            :style="`width: 0; heigth: 0; position: relative;
            top: -50px;
              left: calc(${(store.dates.daysSinceStart / store.dates.durationInDays) * 100}%)
              `" />
          <v-col
            cols="12"
            class="text-center"
            v-if="
              store.dates.daysSinceStart > 0 && store.dates.timeRemaining > 0
            ">
            <div class="text-md-h5 text-h6 font-weight-bold">
              <span>
                <vue-countdown
                  :time="store.dates.timeRemaining"
                  v-slot="{ days, hours, minutes, seconds }">
                  {{ days }} day(s), {{ hours }} hour(s),
                  {{ minutes }} minute(s), {{ seconds }} second(s) left of the
                  league!
                </vue-countdown>
              </span>
              <span class="px-2">-</span>
              <span>Let's Go!</span>
            </div>
          </v-col>
          <v-col
            cols="12"
            class="text-center"
            v-if="store.dates.daysSinceStart <= 0">
            <div class="text-md-h5 text-h6 font-weight-bold">
              <span
                >{{ Math.abs(store.dates.daysSinceStart - 1) }} day(s) until we
                roll</span
              >
              <span class="px-2">-</span>
              <span>HYPE!</span>
            </div>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" class="text-center">
            <span class="text-h4" style="color: goldenrod">
              CURRENT GNL LADDER GODS
            </span>
          </v-col>
          <v-col cols="12" class="my-0 py-0">
            <v-col cols="10" class="mx-auto">
              <hr color="goldenrod" class="my-0 py-0" />
            </v-col>
            <v-col cols="12" md="12" class="pt-0 text-center" v-if="false">
              <v-radio-group
                inline
                v-model="store.ladderGodCategory"
                hide-details>
                <v-radio
                  v-for="(c, i) in store.ladderGodCategories"
                  :label="_capitalize(c)"
                  :disabled="i > 1"
                  :value="c"
                  :style="{
                    color:
                      c === store.ladderGodCategory ? 'goldenrod' : 'inherit',
                  }"
                  density="comfortable" />
              </v-radio-group>
            </v-col>
          </v-col>
          <v-col
            v-if="store.initialized"
            cols="12"
            md="3"
            v-for="(player, rank) in _take(players, 12)"
            :key="rank">
            <GNLPlayerBanner
              logo
              :dates="store.dates"
              :rank="rank"
              :team-points="0"
              :prefix="
                store.data.teams.find((t: any) => t.id === (player as any).team)
                  ?.prefix
              "
              :player="player" />
          </v-col>
          <v-col cols="12" class="text-center" v-else>
            <div
              class="text-h5 fontweight-bold"
              style="color: goldenrod; vertical-align: middle">
              <v-progress-circular indeterminate />
            </div>
            <div class="text-h5 fontweight-bold" style="color: goldenrod">
              Calculating...
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <markdown-viewer v-model="model" />
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>

<style>
.team {
  border: 1px solid transparent;
  cursor: pointer;
  opacity: 0.8;
}
.team:hover {
  opacity: 1;
  border: 1px solid white;
}

.gold {
  background: radial-gradient(
      ellipse farthest-corner at right bottom,
      #fedb37 0%,
      #fdb931 8%,
      #9f7928 30%,
      #8a6e2f 40%,
      transparent 80%
    ),
    radial-gradient(
      ellipse farthest-corner at left top,
      #ffffff 0%,
      #ffffac 8%,
      #d1b464 25%,
      #5d4a1f 62.5%,
      #5d4a1f 100%
    );
}

.team.gold:hover {
  border-color: goldenrod;
}
</style>
