/*
 * @Date: 2023-09-04 11:48:56
 * @LastEditors: yilaisai
 * @LastEditTime: 2025-03-17 16:50:30
 */

// 配置常量
export const GAME_TYPE = [
    { label: '棋牌', value: '1' },
    { label: '捕鱼', value: '2' },
    { label: '电子', value: '3' },
    { label: '体育', value: '4' },
    { label: '视讯', value: '5' },
]

//类型 1=月账单生成时间；2=最晚核对时间；3=最晚付u时间
export const MERCHANT_BILL_CONFIG_TYPE = [
    { label: '月账单生成时间', value: '1' },
    { label: '最晚核对时间', value: '2' },
    { label: '最晚付u时间', value: '3' },
]

// 厂家LOGO图标宽度
export const VENDOR_LOGO_WIDTH = 100

// 厂家LOGO图标高度
export const VENDOR_LOGO_HEIGHT = 100

// 游戏遮罩图宽度
export const GAME_MASK_WIDTH = 180

// 游戏遮罩图高度
export const GAME_MASK_HEIGHT = 85

// (欧美)
export const LIMIT_US = {
    VENDOR_IMG_WIDTH: 320,
    VENDOR_IMG_HEIGHT: 427,
}

// (亚太)
export const LIMIT_AS = {
    VENDOR_IMG_SQUARE_WIDTH: 784,
    VENDOR_IMG_SQUARE_HEIGHT: 314,
    HOT_IMG_WIDTH: 180,
    HOT_IMG_HEIGHT: 180,
}

// 非菜单的页面
export const EXTRA_PAGE_PATH = [
    '/personnel-center/mix-permission',
    '/merchant-config/app-upload',
    '/data-center/merchant-unclear-bill',
    '/merchant-config/merchant-edit',
]

// 不展示顶部货币切换的页面
export const NO_CURRENCY_SELECT_PATH = ['/dashboard']

// h5主题模版数据
export const TEMPLATE_STYLE_DATA = {
    1: [
        { title: 'Bvlgari蓝黑', value: 1, image: '1_bvlgari' },
        { title: 'Aston Martin紫', value: 2, image: '1_aston_martin' },
        { title: 'IWC蓝', value: 3, image: '1_IWC' },
        { title: 'Facebook绿', value: 4, image: '1_facebook' },
        {
            title: 'Elsa Schiaparelli粉',
            value: 5,
            image: '1_elsa_schiaparelli',
        },
        { title: 'Burgundy红', value: 6, image: '1_burgundy' },
        { title: 'Tom Ford绿', value: 7, image: '1_tom_ford' },
        { title: 'Versace黄', value: 8, image: '1_versace' },
        { title: 'sk-ll红', value: 9, image: '1_sk-ll' },
        { title: 'Dior克莱因蓝', value: 10, image: '1_dior_blue' },
        { title: 'facebook蓝', value: 11, image: '1_facebook_blue' },
        // { title: 'Aston Martin紫', value: 12, image: '1_aston_martin' },
        {
            title: 'Chivas Regal 邦迪蓝',
            value: 13,
            image: '1_chivas_regal_blue',
        },
        { title: 'Hermes橙', value: 14, image: '1_hermes_orange' },
        { title: 'USDT绿', value: 15, image: '1_usdt_green' },
        {
            title: 'Patek Philippe浅棕',
            value: 16,
            image: '1_patek_philippe_light_brown',
        },
        {
            title: 'Louis Vuitton棕',
            value: 17,
            image: '1_louis_vuitton_brown',
        },
        { title: 'Ebay紫', value: 18, image: '1_ebay_purple' },
        { title: 'Corum蓝', value: 19, image: '1_corum_blue' },
        { title: 'Twitter蓝', value: 20, image: '1_twitter_blue' },
        { title: 'Gucci绿金', value: 21, image: '1_gucci_green_gold' },
        { title: 'La Mer 绿', value: 22, image: '1_la_mer_green' },
        {
            title: 'Porsche黄绿',
            value: 23,
            image: '1_porsche_yellow_green',
        },
        { title: 'Bvlgari棕', value: 24, image: '1_bvlgari_brown' },
        { title: 'Prada黑', value: 25, image: '1_prada_black' },
        {
            title: 'Bottega Veneta莫兰迪灰',
            value: 26,
            image: '1_bottega_veneta_ash',
        },
        { title: 'Microsoft红', value: 27, image: '1_microsoft_red' },
        { title: 'Armani黑红', value: 28, image: '1_armani_black_red' },
        {
            title: 'Roger Dubuis黑金',
            value: 29,
            image: '1_roger_dubuis_black_gold',
        },
        { title: 'Embraer蓝', value: 30, image: '1_embraer_blue' },
        {
            title: 'Ferrari黑黄',
            value: 31,
            image: '1_ferrari_black_yellow',
        },
        { title: 'Lacoste绿', value: 32, image: '1_lacoste_green' },
        {
            title: 'Victoria Secret红',
            value: 33,
            image: '1_victoria_secret_red',
        },
        { title: 'Lancome水蜜桃色', value: 34, image: '1_lancome_peach' },
        { title: 'Anna Sui紫', value: 35, image: '1_anna_sui_purple' },
        {
            title: 'Bottega Veneta绿',
            value: 36,
            image: '1_bottega_veneta_green',
        },
        { title: 'Furla蓝', value: 37, image: '1_furla_blue' },
        { title: 'Cartier红', value: 38, image: '1_cartier_red' },
        {
            title: 'Estee Lauder蓝',
            value: 39,
            image: '1_estee_lauder_blue',
        },
        { title: '3CE提香红', value: 40, image: '1_3CE_red' },
        { title: 'Burberry褐', value: 41, image: '1_burberry_brown' },
        { title: 'Bordeaux红', value: 42, image: '1_bordeaux_red' },
        { title: 'Breguet 灰', value: 43, image: '1_breguet_ash' },
        { title: 'Hermes棕橙', value: 44, image: '1_hermes_brown_orange' },
        { title: 'Fruitz rose pink', value: 45, image: '1_fruitz_rosePink' },
        { title: 'LOccitane青蓝', value: 46, image: '1_LOccitane_blue' },
        {
            title: 'Burberry午夜蓝白',
            value: 47,
            image: '1_burberry_midnight_blue_white',
        },
        {
            title: 'Valentino墨绿',
            value: 48,
            image: '1_valentino_dark_green',
        },
        { title: 'McLaren黄', value: 49, image: '1_mcLaren_yellow' },
        { title: 'Armani墨黑', value: 50, image: '1_armani_jet_black' },
        { title: 'Curum 灰蓝', value: 51, image: '1_corum_gray_blue' },
        {
            title: 'Aston Martin紫罗兰',
            value: 52,
            image: '1_aston_martin_violet',
        },
        {
            title: 'Carrera y Carrera红',
            value: 53,
            image: '1_carrera_y_carrera_red',
        },
        {
            title: 'Poeche 森林绿',
            value: 54,
            image: '1_porsche_forest_green',
        },
        {
            title: 'Cartier 葡萄酒红',
            value: 55,
            image: '1_cartier_wine_red',
        },
        {
            title: 'Estee Lauder 深紫蓝',
            value: 56,
            image: '1_estee_lauder_dark_purple_blue',
        },
        { title: 'Gucci 红', value: 57, image: '1_gucci_red' },
        {
            title: 'Parmigian Flurier蓝',
            value: 58,
            image: '1_parmigiani_fleurier_blue',
        },
        {
            title: 'Roger Vivier深棕',
            value: 59,
            image: '1_roger_vivier_dark_brown',
        },
        { title: 'Prada 褐', value: 60, image: '1_prada_brown' },
        { title: 'Bulgari绿', value: 61, image: '1_bulgari_green' },
        { title: 'Lanvin紫', value: 62, image: '1_lanvin_purple' },
        { title: 'Montblanc蓝', value: 63, image: '1_montblanc_blue' },
        { title: 'Sergio Rossi 褐', value: 64, image: '1_sergio_rossi_brown' },
        { title: 'Blue Nile', value: 65, image: '1_blue_nile' },
        { title: 'Givenchy 灰绿', value: 66, image: '1_givenchy_gray_green' },
        // { title: 'Cartier 蓝', value: 67, image: '1_cartier_blue' },
        // { title: 'Montblanc红', value: 68, image: '1_montblanc_red' },
        // { title: 'Balenciaga橙', value: 69, image: '1_balenciaga_orange' },
        // {
        //     title: 'Louis Vuitton灰蓝',
        //     value: 70,
        //     image: '1_louis_vuitton_gray_blue',
        // },
        // {
        //     title: 'Brunello Cucinelli 深棕',
        //     value: 71,
        //     image: '1_brunello_cucinelli_dark_brown',
        // },
        // { title: 'Ralph Lauren 棕', value: 72, image: '1_ralph_lauren_brown' },
        // { title: 'Swaroski粉', value: 73, image: '1_swarovski_pink' },
        // { title: 'Boutallion绿', value: 74, image: '1_boutallion_green' },
        // {
        //     title: 'Oasis Italiana黄',
        //     value: 75,
        //     image: '1_oasis_italiana_yellow',
        // },
        // { title: 'Ghiso棕', value: 76, image: '1_ghiso_brown' },
        // { title: 'Chanel黑', value: 77, image: '1_chanel_black' },
        // { title: 'Lalique红', value: 78, image: '1_lalique_red' },
        // { title: 'Dior紫', value: 79, image: '1_dior_purple' },
        // { title: 'Tiffany深蓝', value: 80, image: '1_tiffany_dark_blue' },
        // {
        //     title: 'Salvatore Farragamo绿',
        //     value: 81,
        //     image: '1_salvatore_ferragamo_green',
        // },
        // { title: 'FENDI蓝', value: 82, image: '1_FENDI_blue' },
        // { title: 'Chaumet绿', value: 83, image: '1_chaumet_green' },
        // { title: 'VanCleef红', value: 84, image: '1_van_cleef_red' },
        // { title: 'Gucci绿', value: 85, image: '1_gucci_green' },
        // { title: 'Chpard红', value: 86, image: '1_chopard_red' },
    ],
    2: [
        { title: '深色绿底', value: 1001, image: '2_dark_green' },
        { title: '宝蓝色底', value: 1002, image: '2_royal_blue' },
        { title: '紫金', value: 1003, image: '2_purple_gold' },
        { title: '锈红色底', value: 1004, image: '2_rust_red' },
        { title: '咖啡色底', value: 1005, image: '2_coffee_brown' },
        { title: '油青绿底', value: 1006, image: '2_oil_green' },
        { title: '墨蓝色底', value: 1007, image: '2_dark_blue' },
        { title: '翠绿底', value: 1008, image: '2_emerald_green' },
        { title: '靛蓝色底', value: 1009, image: '2_indigo' },
        { title: '青绿色底', value: 1010, image: '2_turquoise' },
        // { title: '深紫底', value: 1011, image: '2_deep_purple' },
        // { title: '赤褐色底', value: 1012, image: '2_reddish_brown' },
        // { title: '薄荷绿底', value: 1013, image: '2_mint_green' },
        // { title: '陶土色底', value: 1014, image: '2_terracotta' },
        // { title: '叶绿色底', value: 1015, image: '2_leaf_green' },
    ],
    4: [
        { title: '暗黑色底', value: 3001, image: '4_dull_black' },
        { title: '深蓝色底', value: 3002, image: '4_dark_blue' },
        { title: '蓝紫色底', value: 3003, image: '4_blue_purple' },
        { title: '墨绿色底', value: 3004, image: '4_dark_green' },
        { title: '紫色底', value: 3005, image: '4_purple' },
        { title: '黑金色底', value: 3006, image: '4_black_gold' },
        { title: '蓝色底', value: 3007, image: '4_blue' },
        { title: '草绿色底', value: 3008, image: '4_grass_green' },
        { title: '深绿色底', value: 3009, image: '4_deep_green' },
        { title: '黑色底', value: 3010, image: '4_black' },
    ],
    5: [
        { title: '深绿色底', value: 4001, image: '5_deep_green' },
        { title: '浅蓝色底', value: 4002, image: '5_light_blue' },
        { title: '浅黄色底', value: 4003, image: '5_light_yellow' },
    ]
}
