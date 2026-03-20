import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PHETBOT_LOGO = "/Phetbot_No_bg.png";

// ══════════════════════════════════════════════
// PLACES DB (with GPS coords)
// ══════════════════════════════════════════════
const PLACES_DB = {
  // ══ สถานที่ท่องเที่ยว 20 แห่ง ══
  "เขาวัง":          { name:"พระนครคีรี (เขาวัง)",          image:"https://img2.pic.in.th/20240513b953e516db409961bed1e969525ebdae082030.jpg", desc:"พระราชวังโบราณบนยอดเขา สร้างสมัย ร.4 วิวพาโนรามาเมืองเพชรบุรี เปิด 08:30–16:30 น.", nameEn:"Phra Nakhon Khiri (Khao Wang)", nameZh:"帕那空奇里（考旺宫）", descEn:"Hilltop palace by King Rama IV. Open 08:30–16:30.", descZh:"拉玛四世时期建于山顶的宫殿，开放时间08:30–16:30。", price:"150 บาท",         coords:{lat:13.1119,lng:99.9395}, mapsUrl:"https://maps.google.com/maps?q=พระนครคีรี+เขาวัง+เพชรบุรี", type:"attraction" },
  "แก่งกระจาน":     { name:"อุทยานแห่งชาติแก่งกระจาน",     image:"https://travel.mthai.com/app/uploads/2016/09/DSC_2356.jpg",                   desc:"อุทยานใหญ่ที่สุดในไทย ดูนก ทะเลหมอก ล่องแพ แนะนำ พ.ย.–ม.ค.", nameEn:"Kaeng Krachan National Park", nameZh:"凯恩格拉占国家公园", descEn:"Thailand's largest national park. Birdwatching, sea of mist. Best Nov–Jan.", descZh:"泰国最大国家公园，可观鸟、赏云海，11月至1月最佳。",                      price:"100–300 บาท",     coords:{lat:12.8664,lng:99.6340}, mapsUrl:"https://maps.google.com/maps?q=อุทยานแห่งชาติแก่งกระจาน", type:"attraction" },
  "ถ้ำเขาหลวง":     { name:"ถ้ำเขาหลวง",                    image:"https://img.thaicdn.net/u/2022/sutasinee/01/42.jpg",                          desc:"ถ้ำพระพุทธรูปศักดิ์สิทธิ์ แสงธรรมชาติสวยงามตอน 11.00 น.", nameEn:"Khao Luang Cave", nameZh:"考銮洞", descEn:"Sacred cave with Buddha images. Natural light at 11:00.", descZh:"神圣洞窟，供奉佛像，早上11点有自然光束射入。",                         price:"ฟรี",              coords:{lat:13.0739,lng:99.9492}, mapsUrl:"https://maps.google.com/maps?q=ถ้ำเขาหลวง+เพชรบุรี", type:"attraction" },
  "วัดมหาธาตุ":     { name:"วัดมหาธาตุวรวิหาร",             image:"https://upload.wikimedia.org/wikipedia/commons/3/32/WatMahathat.jpg",          desc:"วัดโบราณสไตล์เขมร ปรางค์สูงตระหง่าน อายุกว่า 700 ปี กลางเมืองเพชรบุรี", nameEn:"Wat Mahathat Worawihan", nameZh:"玛哈泰寺", descEn:"Ancient Khmer-style temple, 700+ years old. Free entry.", descZh:"700多年历史的古高棉式寺庙，免费入场。",         price:"ฟรี",              coords:{lat:13.1097,lng:99.9388}, mapsUrl:"https://maps.google.com/maps?q=วัดมหาธาตุวรวิหาร+เพชรบุรี", type:"attraction" },
  "ชายหาดชะอำ":     { name:"หาดชะอำ",                        image:"https://cbtthailand.dasta.or.th/upload-file-api/Resources/RelateAttraction/Images/RAT760040/2.jpeg", desc:"ชายหาดพักผ่อนยอดนิยม ทรายขาว อาหารทะเลสดตลอดแนว", nameEn:"Cha-am Beach", nameZh:"七岩海滩", descEn:"Popular beach resort. White sand, fresh seafood.", descZh:"热门度假海滩，白沙滩，海鲜新鲜美味。", price:"ฟรี", coords:{lat:12.7979,lng:99.9671}, mapsUrl:"https://maps.google.com/maps?q=หาดชะอำ+เพชรบุรี", type:"attraction" },
  "มฤคทายวัน":      { name:"พระราชนิเวศน์มฤคทายวัน",        image:"https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/03/20181203e60b18779c69f051872ce047b4ad437f171442.jpg", desc:"พระตำหนักไม้สักทองริมทะเล สร้างสมัย ร.6 สถาปัตยกรรมงดงาม", nameEn:"Mrigadayavan Palace", nameZh:"玛里嘉雅汪宫", descEn:"Teak wood palace by the sea, built by King Rama VI.", descZh:"拉玛六世修建的柚木海边宫殿，建筑精美。", price:"100 บาท", coords:{lat:12.7415,lng:99.9611}, mapsUrl:"https://maps.google.com/maps?q=พระราชนิเวศน์มฤคทายวัน+ชะอำ", type:"attraction" },
  "หาดเจ้าสำราญ":   { name:"หาดเจ้าสำราญ",                   image:"https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/01/201812013de8a0df78bb5384e0ca4f180a832613160741.jpg", desc:"ชายหาดสงบเงียบ อาหารทะเลสด เหมาะพักผ่อน ห่างจากเมือง 15 กม.", nameEn:"Chao Samran Beach", nameZh:"昭萨兰海滩", descEn:"Quiet beach, fresh seafood, local atmosphere.", descZh:"宁静海滩，海鲜新鲜，充满地方风情。", price:"ฟรี", coords:{lat:13.0173,lng:100.0503}, mapsUrl:"https://maps.google.com/maps?q=หาดเจ้าสำราญ+เพชรบุรี", type:"attraction" },
  "วัดค้างคาว":      { name:"วัดถ้ำแกลงใน (วัดค้างคาว)",     image:"", desc:"ดูค้างคาวบินออกล้านตัวตอนพระอาทิตย์ตก สวยมาก ช่วง เม.ย.–ต.ค.", nameEn:"Tham Klaeng Cave Temple (Bat Cave)", nameZh:"蝙蝠洞寺", descEn:"Watch millions of bats fly at sunset. Apr–Oct.", descZh:"日落时百万蝙蝠飞出，壮观，4月至10月最佳。",                  price:"ฟรี",              coords:{lat:13.2027,lng:99.9476}, mapsUrl:"https://maps.google.com/maps?q=วัดถ้ำแกลงใน+เพชรบุรี", type:"attraction" },
  "อ่างเก็บน้ำ":     { name:"อ่างเก็บน้ำแก่งกระจาน",         image:"", desc:"ทะเลสาบในอุทยาน ล่องเรือชมวิว ตั้งแคมป์ริมน้ำ บรรยากาศธรรมชาติ 100%", nameEn:"Kaeng Krachan Reservoir", nameZh:"凯恩格拉占水库", descEn:"Lake inside the national park. Boat trips, lakeside camping, full nature.", descZh:"国家公园内湖泊，可乘船、露营，自然体验满分。", price:"รวมค่าเข้าอุทยาน", coords:{lat:12.8317,lng:99.6325}, mapsUrl:"https://maps.google.com/maps?q=อ่างเก็บน้ำแก่งกระจาน", type:"attraction" },
  "ตลาดน้ำ":         { name:"ตลาดน้ำบ้านอัมพวา เพชรบุรี",    image:"", desc:"ตลาดน้ำวิถีชุมชน อาหารท้องถิ่น ของฝาก บรรยากาศย้อนยุค เสาร์–อาทิตย์", nameEn:"Floating Market Phetchaburi", nameZh:"碧武里水上市场", descEn:"Local floating market, street food, weekends only.", descZh:"地方水上市场，特色小吃，仅周末开放。",          price:"ฟรี",              coords:{lat:13.11000,lng:99.93000}, mapsUrl:"https://maps.google.com/maps?q=ตลาดน้ำเพชรบุรี", type:"attraction" },
  "วัดยาง":          { name:"วัดยาง ณ รังสี",                 image:"", desc:"วัดเก่าแก่ พระนอนองค์ใหญ่ จิตรกรรมฝาผนังสวยงาม ใกล้ใจกลางเมือง", nameEn:"Wat Yang Na Rangsri", nameZh:"央纳朗斯里寺", descEn:"Ancient temple, large reclining Buddha, beautiful murals near city.", descZh:"古寺，大型卧佛，精美壁画，近市中心。", price:"ฟรี",              coords:{lat:13.10500,lng:99.94000}, mapsUrl:"https://maps.google.com/maps?q=วัดยาง+ณ+รังสี+เพชรบุรี", type:"attraction" },
  "พิพิธภัณฑ์":      { name:"พิพิธภัณฑสถานแห่งชาติเพชรบุรี", image:"", desc:"โบราณวัตถุ ประวัติศาสตร์เพชรบุรี ตั้งแต่ยุคหิน–รัตนโกสินทร์", nameEn:"Phetchaburi National Museum", nameZh:"碧武里国家博物馆", descEn:"Artifacts and history of Phetchaburi from Stone Age to Rattanakosin.", descZh:"碧武里从石器时代到曼谷王朝的文物历史。", price:"30 บาท",          coords:{lat:13.1123,lng:99.9402}, mapsUrl:"https://maps.google.com/maps?q=พิพิธภัณฑสถานแห่งชาติเพชรบุรี", type:"attraction" },
  "น้ำตกห้วยแม่":    { name:"น้ำตกห้วยแม่ประจัน",             image:"", desc:"น้ำตกในอุทยานแก่งกระจาน มีหลายชั้น น้ำใสสะอาด เดินป่าสั้นๆ", nameEn:"Huai Mae Prajan Waterfall", nameZh:"梅普拉占瀑布", descEn:"Multi-tier waterfall in Kaeng Krachan Park. Clear water, short trail.", descZh:"多级瀑布，水清澈，有短途步道。", price:"รวมค่าเข้าอุทยาน", coords:{lat:12.70000,lng:99.58000}, mapsUrl:"https://maps.google.com/maps?q=น้ำตกห้วยแม่ประจัน+แก่งกระจาน", type:"attraction" },
  "ดอยสวนสน":        { name:"ดอยสวนสน (ป่าสนเขาพนมผา)",      image:"", desc:"ป่าสนบนยอดเขา วิวทะเลหมอก อากาศเย็น ช่วง พ.ย.–ก.พ. สวยที่สุด", nameEn:"Doi Suan Son Pine Forest", nameZh:"松树山", descEn:"Pine forest hilltop, sea of mist, cool air. Nov–Feb.", descZh:"山顶松林，云海美景，凉爽宜人，11月至2月最佳。",                 price:"ฟรี",              coords:{lat:12.7791,lng:99.5478}, mapsUrl:"https://maps.google.com/maps?q=ดอยสวนสน+เขาพนมผา+เพชรบุรี", type:"attraction" },
  "วัดพระนอน":       { name:"วัดพระพุทธไสยาสน์",              image:"", desc:"พระนอนขนาดใหญ่ ศิลปะสวยงาม ใกล้เขาวัง 5 นาที", nameEn:"Wat Phra Phutthasaiyas", nameZh:"卧佛寺", descEn:"Large reclining Buddha, beautiful art, near Khao Wang.", descZh:"大型卧佛，艺术精美，距考旺宫仅5分钟。",                                    price:"ฟรี",              coords:{lat:13.1133,lng:99.9378}, mapsUrl:"https://maps.google.com/maps?q=วัดพระพุทธไสยาสน์+เพชรบุรี", type:"attraction" },
  "ตลาดโต้รุ่ง":     { name:"ตลาดโต้รุ่งเพชรบุรี",            image:"", desc:"ตลาดกลางคืน ของกินหลากหลาย เปิดทุกคืน ตั้งแต่ทุ่มถึงตี 2 ราคาถูก", nameEn:"Phetchaburi Night Market", nameZh:"碧武里夜市", descEn:"Night market open daily, lots of food. 19:00–02:00.", descZh:"每晚夜市，美食众多，营业至深夜2点。",              price:"ฟรี",              coords:{lat:13.1002,lng:99.9453}, mapsUrl:"https://maps.google.com/maps?q=ตลาดโต้รุ่งเพชรบุรี", type:"attraction" },
  "แหลมหลวง":        { name:"แหลมหลวง (ชะอำ)",                image:"", desc:"จุดชมวิวทะเล พระอาทิตย์ขึ้น หาดทรายเงียบสงบ ห่างชะอำ 5 กม.", nameEn:"Laem Luang (Cha-am)", nameZh:"拉姆銮角（七岩）", descEn:"Sea viewpoint, sunrise spot, quiet beach, 5 km from Cha-am.", descZh:"海景观景点，日出佳地，宁静海滩，距七岩5公里。", price:"ฟรี",              coords:{lat:12.7695,lng:99.9691}, mapsUrl:"https://maps.google.com/maps?q=แหลมหลวง+ชะอำ+เพชรบุรี", type:"attraction" },
  "เขาหลวง":         { name:"เขาหลวง (ชะอำ)",                 image:"", desc:"ยอดเขาวิวทะเล เดินป่าสั้นๆ ใช้เวลา 1 ชั่วโมง วิวสวยงาม", nameEn:"Khao Luang Hill (Cha-am)", nameZh:"考銮山（七岩）", descEn:"Hilltop with sea views. 1-hour hike, beautiful scenery.", descZh:"山顶俯瞰大海，1小时短途登山。", price:"ฟรี",              coords:{lat:12.7991,lng:99.9548}, mapsUrl:"https://maps.google.com/maps?q=เขาหลวง+ชะอำ+เพชรบุรี", type:"attraction" },
  "สะพานจำลอง":      { name:"ชุมชนบ้านอุ้ม (สะพานแขวน)",     image:"", desc:"สะพานแขวนเก่าแก่ ชุมชนริมน้ำ ถ่ายรูปสวย บรรยากาศเงียบสงบ", nameEn:"Ban Um Suspension Bridge", nameZh:"班乌吊桥村", descEn:"Old suspension bridge in riverside community. Great photo spot.", descZh:"古老吊桥，河边社区，绝佳拍照地点。", price:"ฟรี",              coords:{lat:13.0891,lng:99.9301}, mapsUrl:"https://maps.google.com/maps?q=ชุมชนบ้านอุ้ม+สะพานแขวน+เพชรบุรี", type:"attraction" },
  "หมู่บ้านถ้ำ":     { name:"หมู่บ้านถ้ำ อ.หนองหญ้าปล้อง",   image:"", desc:"ชุมชนรอบถ้ำ วิถีชีวิตท้องถิ่น ธรรมชาติสมบูรณ์ ห่างไกลนักท่องเที่ยว", nameEn:"Cave Village Nong Ya Plong", nameZh:"洞穴村（农雅布隆）", descEn:"Community around caves, local lifestyle, pristine nature, off-the-beaten-path.", descZh:"洞穴周围村庄，体验地方生活，远离喧嚣。", price:"ฟรี",              coords:{lat:13.20000,lng:99.77000}, mapsUrl:"https://maps.google.com/maps?q=หมู่บ้านถ้ำ+หนองหญ้าปล้อง+เพชรบุรี", type:"attraction" },

  // ══ ร้านอาหาร 20 ร้าน ══
  "ร้านขนมหม้อแกงโบราณ":{ name:"ขนมหม้อแกงบ้านนา",          image:"", desc:"ขนมหม้อแกงสูตรต้นตำรับ หอมมะพร้าวหวานกำลังดี ร้านเก่าแก่ดั้งเดิม", nameEn:"Khanom Mo Kaeng (Traditional)", nameZh:"传统椰奶蛋挞", descEn:"Traditional Thai egg custard shop. 30–50 THB/box.", descZh:"传统泰式椰奶蛋挞，30–50泰铢/盒。",           price:"30–50 บาท/กล่อง", coords:{lat:13.1099,lng:99.9355}, mapsUrl:"https://maps.google.com/maps?q=ขนมหม้อแกง+เพชรบุรี", type:"restaurant" },
  "ร้านริมน้ำ":      { name:"ร้านริมน้ำ (เพชรบุรี)",          image:"https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/03/20181203e60b18779c69f051872ce047b4ad437f171442.jpg", desc:"อาหารไทยริมแม่น้ำเพชร บรรยากาศดี เมนูแนะนำ: ต้มยำกุ้ง ปลาหมึกผัดกะเพรา", nameEn:"Rim Nam Restaurant", nameZh:"河边餐厅", descEn:"Thai food by the Phetchaburi River. 150–400 THB.", descZh:"碧武里河边泰式餐厅，150–400泰铢。", price:"150–400 บาท", coords:{lat:13.1099,lng:99.9355}, mapsUrl:"https://maps.google.com/maps?q=ร้านอาหารริมน้ำเพชร+เพชรบุรี", type:"restaurant" },
  "อาหารทะเลเจ้าสำราญ":{ name:"อาหารทะเลเจ้าสำราญ",         image:"https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/01/201812013de8a0df78bb5384e0ca4f180a832613160741.jpg", desc:"อาหารทะเลสดหาดเจ้าสำราญ ปลาหมึกย่าง กุ้งทอดกระเทียม หอยนางรม", nameEn:"Chao Samran Seafood", nameZh:"昭萨兰海鲜", descEn:"Fresh seafood at Chao Samran Beach. 200–500 THB.", descZh:"昭萨兰海滩新鲜海鲜，200–500泰铢。", price:"200–500 บาท", coords:{lat:13.0173,lng:100.0503}, mapsUrl:"https://maps.google.com/maps?q=อาหารทะเลเจ้าสำราญ+เพชรบุรี", type:"restaurant" },
  "ข้าวแกงเพชร":     { name:"ร้านข้าวแกงเพชรบุรี (ตลาดใต้)",  image:"", desc:"ข้าวแกงป้าจุ๊ รสชาติบ้านๆ ต้มกะทิ แกงเขียวหวาน แน่นหนาราคาถูก", nameEn:"Phetchaburi Rice & Curry", nameZh:"碧武里咖喱饭", descEn:"Hearty local curry rice, homestyle cooking. 50–80 THB.", descZh:"家常咖喱饭，口味地道，50–80泰铢。", price:"50–80 บาท",       coords:{lat:13.1048,lng:99.9421}, mapsUrl:"https://maps.google.com/maps?q=ข้าวแกงเพชรบุรี+ตลาด", type:"restaurant" },
  "ก๋วยเตี๋ยวหมู":   { name:"ก๋วยเตี๋ยวหมูสด (ตลาดเช้า)",    image:"", desc:"ก๋วยเตี๋ยวหมูสดน้ำใสหอมกลิ่นตัง เปิดเช้า 6–11 โมง คนเมืองเพชรกินทุกวัน", nameEn:"Fresh Pork Noodles (Morning Market)", nameZh:"鲜猪肉面（早市）", descEn:"Clear broth pork noodles, locals daily breakfast. Open 06:00-11:00.", descZh:"清汤鲜猪肉面，当地人每日早餐，早6至11点。", price:"40–60 บาท",       coords:{lat:13.1121,lng:99.9382}, mapsUrl:"https://maps.google.com/maps?q=ก๋วยเตี๋ยวหมูสด+ตลาดเช้า+เพชรบุรี", type:"restaurant" },
  "ขนมจีนเพชรบุรี":  { name:"ขนมจีนแม่อรุณ",                  image:"", desc:"ขนมจีนน้ำยาปูสูตรโบราณ เส้นทำเองสด เครื่องเคียงครบ เปิดเช้า", nameEn:"Khanom Jeen Mae Aroon", nameZh:"碧武里米线（阿荣）", descEn:"Traditional rice noodles with crab curry, homemade, open mornings.", descZh:"传统米线配螃蟹咖喱，自制面条，早市供应。", price:"50–80 บาท",       coords:{lat:13.1079,lng:99.9401}, mapsUrl:"https://maps.google.com/maps?q=ขนมจีนแม่อรุณ+เพชรบุรี", type:"restaurant" },
  "โรตีมัทสยาม":     { name:"โรตีมัทสยาม (ชะอำ)",             image:"", desc:"โรตีกรอบสูตรเด็ด ไส้กล้วย ไข่ นมข้น ราคาถูก คนท้องถิ่นชอบมาก", nameEn:"Roti Mat Siam Cha-am", nameZh:"七岩暹罗薄饼", descEn:"Crispy roti with banana, egg, condensed milk. Cheap local favourite.", descZh:"香脆薄饼配香蕉、鸡蛋和炼奶，价格实惠。", price:"20–40 บาท",       coords:{lat:12.79500,lng:99.96500}, mapsUrl:"https://maps.google.com/maps?q=โรตีชะอำ", type:"restaurant" },
  "ครัวสุดา":        { name:"ครัวสุดา ซีฟู้ด (ชะอำ)",          image:"", desc:"อาหารทะเลสดชะอำ ปูนิ่ม กุ้งแม่น้ำ วิวทะเล บรรยากาศดี", nameEn:"Krua Suda Seafood Cha-am", nameZh:"苏达海鲜（七岩）", descEn:"Fresh seafood in Cha-am: soft-shell crab, river prawns, sea view.", descZh:"七岩新鲜海鲜，软壳蟹、河虾，可欣赏海景。", price:"200–600 บาท",     coords:{lat:12.80000,lng:99.96800}, mapsUrl:"https://maps.google.com/maps?q=ครัวสุดา+ซีฟู้ด+ชะอำ", type:"restaurant" },
  "บะหมี่เป็ดย่าง":  { name:"บะหมี่เป็ดย่างเพชรบุรี",          image:"", desc:"บะหมี่เส้นสดต้มน้ำซุปเป็ดข้น เป็ดย่างนุ่ม รสชาติเข้มข้น", nameEn:"Roast Duck Noodles", nameZh:"烤鸭面", descEn:"Fresh egg noodles in rich duck broth with roast duck. Bold flavour.", descZh:"鲜蛋面配浓郁鸭汤和烤鸭片，风味独特。", price:"60–80 บาท",       coords:{lat:13.10600,lng:99.94100}, mapsUrl:"https://maps.google.com/maps?q=บะหมี่เป็ดย่าง+เพชรบุรี", type:"restaurant" },
  "ไอศครีมชาวเพชร":  { name:"ไอศครีมชาวเพชร (หน้าเขาวัง)",    image:"", desc:"ไอศครีมกะทิสดรสโบราณ ทำเองทุกวัน คนเพชรกินมา 40 ปี", nameEn:"Chao Phet Ice Cream (Khao Wang)", nameZh:"考旺椰奶冰淇淋", descEn:"Homemade coconut ice cream near Khao Wang, locals favourite 40 years.", descZh:"考旺山附近自制椰奶冰淇淋，当地人喜爱40年。", price:"25–40 บาท",       coords:{lat:13.11300,lng:99.93700}, mapsUrl:"https://maps.google.com/maps?q=ไอศครีมชาวเพชร+เขาวัง", type:"restaurant" },
  "ปิ้งย่างหาดชะอำ": { name:"บาร์บีคิวริมหาดชะอำ",             image:"", desc:"ปิ้งย่างซีฟู้ดริมหาด เปิดเย็น บรรยากาศสบาย ลมทะเล กินแบบ casual", nameEn:"Cha-am Beachside BBQ", nameZh:"七岩海滩烧烤", descEn:"Casual seafood BBQ by the beach, sea breeze, open evenings.", descZh:"海边休闲海鲜烧烤，海风习习，傍晚营业。", price:"150–350 บาท",     coords:{lat:12.79800,lng:99.96700}, mapsUrl:"https://maps.google.com/maps?q=บาร์บีคิว+ริมหาดชะอำ", type:"restaurant" },
  "หมูกระทะเพชร":    { name:"หมูกระทะเพชรบุรี (ตลาดโต้รุ่ง)", image:"", desc:"หมูกระทะบุฟเฟต์ราคาถูก เนื้อสด ผักสดใหม่ เปิดทุกคืน", nameEn:"Phet Moo Kratha Buffet", nameZh:"碧武里泰式烤肉自助", descEn:"Affordable Thai BBQ buffet, fresh meat and vegetables, open nightly.", descZh:"实惠泰式烤肉自助，新鲜食材，每晚供应。", price:"99–149 บาท",      coords:{lat:13.1002,lng:99.9453}, mapsUrl:"https://maps.google.com/maps?q=หมูกระทะ+ตลาดโต้รุ่ง+เพชรบุรี", type:"restaurant" },
  "ส้มตำลาวเพชร":    { name:"ส้มตำลาวป้าแดง",                  image:"", desc:"ส้มตำสูตรอีสาน รสแซ่บ ปูปลาร้า ไก่ย่างหอม ราคาชาวบ้าน", nameEn:"Pa Daeng Papaya Salad", nameZh:"拍当木瓜沙拉", descEn:"Isaan-style spicy papaya salad with crab and grilled chicken.", descZh:"东北风味辣木瓜沙拉配螃蟹和烤鸡，价格亲民。", price:"50–120 บาท",      coords:{lat:13.10200,lng:99.93600}, mapsUrl:"https://maps.google.com/maps?q=ส้มตำ+เพชรบุรี", type:"restaurant" },
  "ร้านกาแฟเขาวัง":  { name:"คาเฟ่วิวเขาวัง",                  image:"", desc:"คาเฟ่วิวสวย มองเห็นเขาวัง กาแฟหอม เค้กโฮมเมด เหมาะถ่ายรูป", nameEn:"Khao Wang View Cafe", nameZh:"考旺景观咖啡馆", descEn:"Cafe with Khao Wang view, aromatic coffee and homemade cake.", descZh:"可望见考旺宫的咖啡馆，咖啡香醇，自制蛋糕。", price:"80–150 บาท",      coords:{lat:13.1099,lng:99.9381}, mapsUrl:"https://maps.google.com/maps?q=คาเฟ่+เขาวัง+เพชรบุรี", type:"restaurant" },
  "ข้าวต้มเพชร":     { name:"ข้าวต้มเพชรบุรี (ร้านดัง)",        image:"", desc:"ข้าวต้มกุ้ง ปลา เนื้อ ต้มแบบโบราณน้ำใส เปิดตี 4 ถึงเที่ยง", nameEn:"Phet Congee Famous Shop", nameZh:"碧武里名店粥铺", descEn:"Shrimp/fish/pork congee, old-style clear broth. Open 04:00-noon.", descZh:"虾/鱼/猪肉清汤粥，传统老味道，早4点至中午。", price:"60–100 บาท",      coords:{lat:13.10800,lng:99.93900}, mapsUrl:"https://maps.google.com/maps?q=ข้าวต้ม+เพชรบุรี", type:"restaurant" },
  "สุกี้ชะอำ":       { name:"สุกี้ทะเลชะอำ",                   image:"", desc:"สุกี้น้ำซุปกุ้งสด เนื้อปลาสด หอยแมลงภู่ เปิดเย็นถึงดึก", nameEn:"Cha-am Seafood Suki", nameZh:"七岩海鲜涮锅", descEn:"Seafood hotpot with fresh shrimp broth, mussels, fish. Open evenings.", descZh:"鲜虾汤底海鲜涮锅，贻贝、鱼肉新鲜，傍晚营业。", price:"150–300 บาท",     coords:{lat:12.79200,lng:99.96400}, mapsUrl:"https://maps.google.com/maps?q=สุกี้ทะเล+ชะอำ", type:"restaurant" },
  "ผัดไทยเพชร":      { name:"ผัดไทยกุ้งสดเพชรบุรี",             image:"", desc:"ผัดไทยเส้นจันท์ กุ้งแม่น้ำสด ไข่ไก่ ถั่วงอก รสชาติจัดจ้าน", nameEn:"Phet Pad Thai River Shrimp", nameZh:"碧武里河虾炒河粉", descEn:"Pad Thai with fresh river shrimp and rice noodles. Bold flavour.", descZh:"新鲜河虾炒河粉，味道浓郁。", price:"80–120 บาท",      coords:{lat:13.10700,lng:99.94000}, mapsUrl:"https://maps.google.com/maps?q=ผัดไทยกุ้งสด+เพชรบุรี", type:"restaurant" },
  "ข้าวหมูแดงเพชร":  { name:"ข้าวหมูแดง หมูกรอบ (ตลาดเช้า)",   image:"", desc:"หมูแดงนุ่มราดซอสหอม หมูกรอบกรุบกริบ เปิดเช้าถึงเที่ยง", nameEn:"Red Pork and Crispy Pork Rice", nameZh:"红叉烧脆猪肉饭", descEn:"Tender red pork with sweet sauce and crispy pork crackling. Morning till noon.", descZh:"嫩滑红叉烧和脆皮猪肉，早市至中午供应。", price:"50–80 บาท",       coords:{lat:13.11000,lng:99.94200}, mapsUrl:"https://maps.google.com/maps?q=ข้าวหมูแดง+ตลาดเช้า+เพชรบุรี", type:"restaurant" },
  "ของหวานเพชร":     { name:"ร้านของหวานเพชรบุรี (ตรอกเก่า)",   image:"", desc:"บัวลอย วุ้นกะทิ ขนมชั้น ทับทิมกรอบ สูตรโบราณดั้งเดิม", nameEn:"Phetchaburi Traditional Sweets", nameZh:"碧武里传统甜品", descEn:"Boaloy, coconut jelly, layered cake — traditional old-style recipes.", descZh:"汤圆、椰子果冻、千层糕，均为古法制作。", price:"30–60 บาท",       coords:{lat:13.10900,lng:99.93700}, mapsUrl:"https://maps.google.com/maps?q=ของหวาน+เพชรบุรี", type:"restaurant" },
  "seafood_chaosaman":{ name:"อาหารทะเลเจ้าสำราญ (สาขา 2)",    image:"https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/01/201812013de8a0df78bb5384e0ca4f180a832613160741.jpg", desc:"สาขา 2 ใกล้หาด เมนูเด็ด: ปูผัดผงกะหรี่ กุ้งเผา", nameEn:"Chao Samran Seafood Branch 2", nameZh:"昭萨兰海鲜2号店", descEn:"Branch 2 near the beach. Signature: curry crab, grilled prawns.", descZh:"近海滩2号分店，招牌菜：咖喱蟹、烤虾。", price:"200–500 บาท", coords:{lat:13.02000,lng:100.04500}, mapsUrl:"https://maps.google.com/maps?q=อาหารทะเลเจ้าสำราญ+หาดเจ้าสำราญ", type:"restaurant" },

  // ══ ที่พัก 30 แห่ง ══
  "dusit_huahin":    { name:"Dusit Thani Hua Hin",               image:"https://img2.pic.in.th/366880381.jpg",                                         desc:"5-star luxury resort ใกล้ชะอำ สระว่ายน้ำ สปา วิวทะเล", nameEn:"Dusit Thani Hua Hin", nameZh:"华欣杜喜塔尼", descEn:"5-star luxury resort near Cha-am. Pool, spa, sea view.", descZh:"五星豪华度假村，近七岩，泳池、水疗、海景。", price:"3,500–8,000/คืน", coords:{lat:12.5710,lng:99.9578}, mapsUrl:"https://maps.google.com/maps?q=Dusit+Thani+Hua+Hin+Resort", booking:"https://www.booking.com/hotel/th/dusit-thani-hua-hin.th.html", type:"hotel" },
  "kaeng_resort":    { name:"Kaeng Krachan Camp & Resort",        image:"https://img2.pic.in.th/643396939_904572975672909_3528937264899095705_n.jpg",  desc:"รีสอร์ทติดอุทยานแก่งกระจาน บรรยากาศธรรมชาติ ดูนกยามเช้า", nameEn:"Kaeng Krachan Camp & Resort", nameZh:"凯恩格拉占营地度假村", descEn:"Nature resort next to the national park. Birdwatching.", descZh:"毗邻国家公园的自然度假村，适合观鸟。", price:"800–1,500/คืน", coords:{lat:12.8501,lng:99.6012}, mapsUrl:"https://maps.google.com/maps?q=Kaeng+Krachan+Camp+Resort", booking:"https://www.booking.com/searchresults.th.html?ss=Kaeng+Krachan", type:"hotel" },
  "cha_am_resort":   { name:"Cha Am Methavalai Hotel",            image:"", desc:"โรงแรม 4 ดาวริมหาดชะอำ สิ่งอำนวยความสะดวกครบ เหมาะครอบครัว", nameEn:"Cha Am Methavalai Hotel", nameZh:"七岩梅沙瓦莱酒店", descEn:"4-star beachfront hotel in Cha-am. Full facilities, family-friendly.", descZh:"七岩四星级海滨酒店，设施齐全，适合家庭。", price:"2,000–3,500/คืน", coords:{lat:12.7952,lng:99.9698}, mapsUrl:"https://maps.google.com/maps?q=Cha+Am+Methavalai+Hotel", booking:"https://www.booking.com/searchresults.th.html?ss=Cha+Am+hotel",      type:"hotel" },
  "regent_chaam":    { name:"Regent Cha Am Beach Resort",         image:"", desc:"รีสอร์ทใหญ่ติดหาด สระว่ายน้ำ กีฬาทางน้ำ ร้านอาหาร เหมาะครอบครัว", nameEn:"Regent Cha Am Beach Resort", nameZh:"七岩摄政海滩度假村", descEn:"Large beachfront resort: pool, water sports, restaurant. Family-friendly.", descZh:"大型海滨度假村，泳池、水上运动和餐厅齐全。", price:"1,800–3,200/คืน", coords:{lat:12.8049,lng:99.9710}, mapsUrl:"https://maps.google.com/maps?q=Regent+Cha+Am+Beach+Resort", booking:"https://www.booking.com/hotel/th/regent-cha-am-beach.th.html",     type:"hotel" },
  "veranda_resort":  { name:"Veranda Resort Cha-Am",              image:"", desc:"รีสอร์ทวิวทะเล สไตล์โคโลเนียล สระว่ายน้ำอินฟินิตี้", nameEn:"Veranda Resort Cha-Am", nameZh:"七岩维兰达度假村", descEn:"Colonial-style sea-view resort with infinity pool.", descZh:"殖民地风格海景度假村，配有无边泳池。", price:"2,500–4,500/คืน", coords:{lat:12.80300,lng:99.97000}, mapsUrl:"https://maps.google.com/maps?q=Veranda+Resort+Spa+Hua+Hin+Cha+Am", booking:"https://www.booking.com/hotel/th/veranda-resort-and-spa-hua-hin-cha-am.th.html", type:"hotel" },
  "beach_garden":    { name:"Beach Garden Hotel Cha Am",          image:"", desc:"โรงแรมสวนสวยริมหาด สระว่ายน้ำ ร้านอาหาร บรรยากาศผ่อนคลาย", nameEn:"Beach Garden Hotel Cha Am", nameZh:"七岩花园海滩酒店", descEn:"Garden hotel by the beach, pool, restaurant, relaxing atmosphere.", descZh:"海滩花园酒店，含泳池和餐厅，氛围轻松。", price:"1,200–2,200/คืน", coords:{lat:12.80100,lng:99.96900}, mapsUrl:"https://maps.google.com/maps?q=Beach+Garden+Hotel+Cha+Am", booking:"https://www.booking.com/hotel/th/beach-garden-cha-am.th.html",      type:"hotel" },
  "long_beach":      { name:"Long Beach Cha-Am Hotel",            image:"", desc:"โรงแรมริมหาดยาว สระว่ายน้ำ ห้องพักวิวทะเล ราคาคุ้มค่า", nameEn:"Long Beach Cha-Am Hotel", nameZh:"七岩长滩酒店", descEn:"Beachfront hotel, sea-view rooms and pool. Value for money.", descZh:"海滨酒店，含海景房和泳池，性价比高。", price:"900–1,800/คืน",   coords:{lat:12.79800,lng:99.97000}, mapsUrl:"https://maps.google.com/maps?q=Long+Beach+Cha+Am+Hotel", booking:"https://www.booking.com/hotel/th/long-beach-cha-am.th.html",        type:"hotel" },
  "rimnam_hotel":    { name:"โรงแรมริมเพชร (ในเมือง)",            image:"", desc:"ใจกลางเมืองเพชรบุรี ใกล้เขาวัง ตลาด สะดวกเดินทาง ราคาประหยัด", nameEn:"Rim Phet Hotel City Center", nameZh:"碧武里市中心酒店", descEn:"Central Phetchaburi, near Khao Wang and market. Budget-friendly.", descZh:"碧武里市中心，靠近考旺宫和市场，价格实惠。", price:"600–1,000/คืน",   coords:{lat:13.11000,lng:99.94000}, mapsUrl:"https://maps.google.com/maps?q=Rim+Phet+Hotel+Phetchaburi", booking:"https://www.booking.com/searchresults.th.html?ss=Phetchaburi",      type:"hotel" },
  "phetburi_hotel":  { name:"เพชรบุรี ซิตี้ โฮเทล",              image:"", desc:"โรงแรมใหม่ใจกลางเมือง WiFi ฟรี ที่จอดรถ เหมาะทริปสั้น", nameEn:"Phetchaburi City Hotel", nameZh:"碧武里城市酒店", descEn:"New city center hotel, free WiFi, parking. Good for short stays.", descZh:"新开业市中心酒店，免费WiFi，有停车场。", price:"500–900/คืน",     coords:{lat:13.10800,lng:99.93800}, mapsUrl:"https://maps.google.com/maps?q=Phetchaburi+City+Hotel", booking:"https://www.booking.com/searchresults.th.html?ss=Phetchaburi",      type:"hotel" },
  "guesthouse_wang": { name:"เกสต์เฮ้าส์ใกล้เขาวัง",             image:"https://img2.pic.in.th/20240513b953e516db409961bed1e969525ebdae082030.jpg", desc:"เดินถึงเขาวัง 10 นาที ห้องสะอาด เจ้าของใจดี เหมาะแบกเป้", nameEn:"Guesthouse near Khao Wang", nameZh:"考旺山民宿", descEn:"10-min walk to Khao Wang, clean rooms, friendly owner. Backpacker-friendly.", descZh:"步行10分钟可达考旺宫，房间整洁，房东热情。", price:"400–700/คืน", coords:{lat:13.11400,lng:99.93600}, mapsUrl:"https://maps.google.com/maps?q=Guesthouse+Khao+Wang+Phetchaburi", booking:"https://www.booking.com/searchresults.th.html?ss=Phetchaburi+Khao+Wang", type:"hotel" },
  "rimnam_homestay": { name:"โฮมสเตย์ริมน้ำเพชร",                 image:"https://img2.pic.in.th/643396939_904572975672909_3528937264899095705_n.jpg", desc:"บ้านโฮมสเตย์ริมแม่น้ำ อาหารเช้าบ้านๆ บรรยากาศชิลล์", nameEn:"Rim Nam Riverside Homestay", nameZh:"河边民宿", descEn:"Cozy homestay by the river. Breakfast included.", descZh:"惬意河边民宿，含早餐。", price:"400–650/คืน", coords:{lat:13.11100,lng:99.93400}, mapsUrl:"https://maps.google.com/maps?q=Riverside+Homestay+Phetchaburi", booking:"https://www.booking.com/searchresults.th.html?ss=Phetchaburi", type:"hotel" },
  "kaeng_homestay":  { name:"บ้านพักธรรมชาติแก่งกระจาน",          image:"", desc:"โฮมสเตย์ติดป่า ดูนกยามเช้า อากาศบริสุทธิ์ ห่างไกลความวุ่นวาย", nameEn:"Kaeng Krachan Nature Homestay", nameZh:"凯恩格拉占自然民宿", descEn:"Forest homestay for birdwatching, fresh air, peaceful.", descZh:"林边民宿，适合观鸟，空气清新，环境宁静。", price:"500–800/คืน",     coords:{lat:12.86000,lng:99.64000}, mapsUrl:"https://maps.google.com/maps?q=Homestay+Kaeng+Krachan", booking:"https://www.booking.com/searchresults.th.html?ss=Kaeng+Krachan",     type:"hotel" },
  "forest_resort":   { name:"Forest Hill Resort แก่งกระจาน",      image:"", desc:"รีสอร์ทกลางป่า ติดอุทยาน วิวภูเขา สระว่ายน้ำ เงียบสงบ", nameEn:"Forest Hill Resort Kaeng Krachan", nameZh:"凯恩格拉占森林山度假村", descEn:"Mid-forest resort next to the park, mountain view, pool.", descZh:"紧邻公园的森林度假村，山景泳池，安静宜人。", price:"900–1,600/คืน",   coords:{lat:12.87000,lng:99.62000}, mapsUrl:"https://maps.google.com/maps?q=Forest+Hill+Resort+Kaeng+Krachan", booking:"https://www.booking.com/searchresults.th.html?ss=Forest+Hill+Kaeng", type:"hotel" },
  "cha_am_villa":    { name:"Cha Am Pool Villa",                   image:"", desc:"วิลล่าสระว่ายน้ำส่วนตัวชะอำ เหมาะกลุ่มเพื่อน/ครอบครัว ครัวส่วนตัว", nameEn:"Cha Am Pool Villa", nameZh:"七岩私人泳池别墅", descEn:"Private pool villa in Cha-am, ideal for groups/families. Private kitchen.", descZh:"七岩私人泳池别墅，适合团体或家庭，配有私人厨房。", price:"2,000–4,000/คืน", coords:{lat:12.80200,lng:99.97100}, mapsUrl:"https://maps.google.com/maps?q=Pool+Villa+Cha+Am", booking:"https://www.booking.com/searchresults.th.html?ss=Pool+Villa+Cha+Am", type:"hotel" },
  "sunrise_chaam":   { name:"Sunrise Resort Cha Am",               image:"", desc:"รีสอร์ทติดทะเล ห้องวิวทะเล อาหารเช้าริมหาด ดูพระอาทิตย์ขึ้น", nameEn:"Sunrise Resort Cha Am", nameZh:"七岩日出度假村", descEn:"Beachfront resort, sea-view rooms, sunrise breakfast by the beach.", descZh:"海滨度假村，含海景房，可在海边享用日出早餐。", price:"1,400–2,600/คืน", coords:{lat:12.80400,lng:99.97200}, mapsUrl:"https://maps.google.com/maps?q=Sunrise+Resort+Cha+Am", booking:"https://www.booking.com/searchresults.th.html?ss=Sunrise+Resort+Cha+Am", type:"hotel" },
  "palm_garden":     { name:"Palm Garden Resort Cha Am",           image:"", desc:"รีสอร์ทสวนปาล์มริมหาด สระว่ายน้ำ Wi-Fi ฟรี เหมาะครอบครัว", nameEn:"Palm Garden Resort Cha Am", nameZh:"七岩棕榈花园度假村", descEn:"Palm-garden beachfront resort, pool, free WiFi. Family-friendly.", descZh:"棕榈花园海滨度假村，含泳池和免费WiFi。", price:"1,000–1,800/คืน", coords:{lat:12.79700,lng:99.97000}, mapsUrl:"https://maps.google.com/maps?q=Palm+Garden+Resort+Cha+Am", booking:"https://www.booking.com/hotel/th/palm-garden.th.html",               type:"hotel" },
  "amari_huahin":    { name:"Amari Hua Hin (ใกล้ชะอำ)",            image:"", desc:"โรงแรม 5 ดาว สระว่ายน้ำหลายชั้น สปา ห่างชะอำ 30 นาที", nameEn:"Amari Hua Hin near Cha-am", nameZh:"华欣阿玛瑞酒店（近七岩）", descEn:"5-star hotel with multiple pools, spa. 30 min from Cha-am.", descZh:"五星级酒店，多泳池、水疗，距七岩30分钟。", price:"3,000–6,000/คืน", coords:{lat:12.58000,lng:99.97000}, mapsUrl:"https://maps.google.com/maps?q=Amari+Hua+Hin", booking:"https://www.booking.com/hotel/th/amari-hua-hin.th.html",             type:"hotel" },
  "imperial_chaam":  { name:"The Imperial Cha Am",                 image:"", desc:"โรงแรมคลาสสิคชะอำ สระว่ายน้ำ เทนนิส ร้านอาหาร บรรยากาศเงียบ", nameEn:"The Imperial Cha Am", nameZh:"七岩帝王酒店", descEn:"Classic Cha-am hotel, pool, tennis, restaurant, quiet setting.", descZh:"七岩经典酒店，含泳池、网球场和餐厅。", price:"1,200–2,500/คืน", coords:{lat:12.80000,lng:99.96800}, mapsUrl:"https://maps.google.com/maps?q=The+Imperial+Cha+Am+Beach+Hotel", booking:"https://www.booking.com/hotel/th/the-imperial-cha-am-beach.th.html", type:"hotel" },
  "baan_suan":       { name:"บ้านสวนรีสอร์ท เพชรบุรี",            image:"", desc:"รีสอร์ทสวนสวย บรรยากาศไทยๆ สระว่ายน้ำ เหมาะครอบครัว ราคาเป็นมิตร", nameEn:"Baan Suan Resort Phetchaburi", nameZh:"碧武里花园度假村", descEn:"Thai-style garden resort, pool, family-friendly, good value.", descZh:"泰式花园度假村，含泳池，家庭友好，性价比高。", price:"700–1,200/คืน",   coords:{lat:13.10000,lng:99.93000}, mapsUrl:"https://maps.google.com/maps?q=Baan+Suan+Resort+Phetchaburi", booking:"https://www.booking.com/searchresults.th.html?ss=Baan+Suan+Phetchaburi", type:"hotel" },
  "eco_lodge":       { name:"Eco Lodge เพชรบุรี",                   image:"", desc:"ที่พักอิงธรรมชาติ วัสดุท้องถิ่น Solar cell eco-friendly", nameEn:"Eco Lodge Phetchaburi", nameZh:"碧武里生态小屋", descEn:"Eco-friendly lodge with local materials and solar power.", descZh:"使用当地材料和太阳能的环保小屋。", price:"600–1,200/คืน",   coords:{lat:12.84000,lng:99.65000}, mapsUrl:"https://maps.google.com/maps?q=Eco+Lodge+Kaeng+Krachan", booking:"https://www.booking.com/searchresults.th.html?ss=Eco+Lodge+Phetchaburi", type:"hotel" },
  "sea_breeze":      { name:"Sea Breeze Resort Cha Am",             image:"", desc:"รีสอร์ทลมทะเล ริมหาด ราคาเป็นมิตร เหมาะกลุ่มเพื่อน", nameEn:"Sea Breeze Resort Cha Am", nameZh:"七岩海风度假村", descEn:"Breezy beachfront resort, affordable, great for groups.", descZh:"七岩海滨度假村，价格实惠，适合团体出游。", price:"800–1,500/คืน",   coords:{lat:12.80200,lng:99.96900}, mapsUrl:"https://maps.google.com/maps?q=Sea+Breeze+Resort+Cha+Am", booking:"https://www.booking.com/searchresults.th.html?ss=Sea+Breeze+Cha+Am",   type:"hotel" },
  "khiri_wiang":     { name:"คีรีเวียง รีสอร์ท แก่งกระจาน",       image:"", desc:"รีสอร์ทวิวเขา ใกล้อุทยาน บรรยากาศสงบ เดินทางสะดวก", nameEn:"Khiri Wiang Resort Kaeng Krachan", nameZh:"凯恩格拉占奇里维昂度假村", descEn:"Mountain-view resort near the park, peaceful, easy access.", descZh:"靠近公园的山景度假村，环境幽静，交通便利。", price:"700–1,300/คืน",   coords:{lat:12.88000,lng:99.61500}, mapsUrl:"https://maps.google.com/maps?q=Khiri+Wiang+Resort+Kaeng+Krachan", booking:"https://www.booking.com/searchresults.th.html?ss=Khiri+Wiang",         type:"hotel" },
  "mrigadayavan_h":  { name:"โรงแรมมฤคทายวัน (ชะอำ)",              image:"", desc:"เงียบสงบใกล้พระราชนิเวศน์มฤคทายวัน วิวทะเล ห้องพักสะอาด", nameEn:"Mrigadayavan Hotel Cha-am", nameZh:"玛里嘉雅汪酒店（七岩）", descEn:"Quiet hotel near Mrigadayavan Palace, sea view, clean rooms.", descZh:"靠近玛里嘉雅汪宫的安静酒店，海景，房间整洁。", price:"800–1,400/คืน",   coords:{lat:12.74000,lng:99.96000}, mapsUrl:"https://maps.google.com/maps?q=Hotel+Mrigadayavan+Cha+Am", booking:"https://www.booking.com/searchresults.th.html?ss=Mrigadayavan+Cha+Am", type:"hotel" },
  "baan_krating":    { name:"บ้านกระติ้ง (Baan Krating)",           image:"", desc:"รีสอร์ทธรรมชาติ วิวเขา อากาศเย็น เหมาะพักผ่อน ใกล้อุทยาน", nameEn:"Baan Krating Resort", nameZh:"班格拉廷度假村", descEn:"Nature resort, mountain view, cool climate near national park.", descZh:"山景自然度假村，气候凉爽，靠近国家公园。", price:"600–1,200/คืน",   coords:{lat:12.86500,lng:99.61000}, mapsUrl:"https://maps.google.com/maps?q=Baan+Krating+Resort+Kaeng+Krachan", booking:"https://www.booking.com/searchresults.th.html?ss=Baan+Krating",        type:"hotel" },
  "saimork_villa":   { name:"Saimork Villa (ชะอำ)",                 image:"", desc:"วิลล่าสงบงาม สระส่วนตัว บรรยากาศโรแมนติก เหมาะคู่รัก", nameEn:"Saimork Villa Cha-am", nameZh:"赛莫克别墅（七岩）", descEn:"Romantic private pool villa, perfect for couples.", descZh:"浪漫私人泳池别墅，非常适合情侣入住。", price:"1,500–2,500/คืน", coords:{lat:12.80000,lng:99.97200}, mapsUrl:"https://maps.google.com/maps?q=Saimork+Villa+Cha+Am", booking:"https://www.booking.com/searchresults.th.html?ss=Saimork+Villa",        type:"hotel" },
  "kaeng_camping":   { name:"แคมป์ปิ้งอุทยานแก่งกระจาน",           image:"", desc:"เต็นท์ริมอ่างเก็บน้ำ บรรยากาศธรรมชาติ 100% ต้องจองล่วงหน้า", nameEn:"Kaeng Krachan National Park Camping", nameZh:"凯恩格拉占国家公园露营", descEn:"Tent camping by the reservoir, 100% nature. Advance booking required.", descZh:"水库边帐篷露营，100%自然体验，需提前预订。", price:"100–300/คืน",     coords:{lat:12.8317,lng:99.6325}, mapsUrl:"https://maps.google.com/maps?q=Kaeng+Krachan+National+Park+Camping", booking:"https://www.thainationalparks.com/kaeng-krachan-national-park",        type:"hotel" },
  "nature_retreat":  { name:"Nature Retreat เพชรบุรี",              image:"", desc:"ที่พักกลางธรรมชาติ ใกล้แก่งกระจาน กิจกรรมเดินป่า ดูนก", nameEn:"Nature Retreat Phetchaburi", nameZh:"碧武里自然静修营", descEn:"Nature stay near Kaeng Krachan, hiking and birdwatching.", descZh:"靠近凯恩格拉占的自然住宿，提供徒步和观鸟活动。", price:"500–1,000/คืน",   coords:{lat:12.84500,lng:99.64000}, mapsUrl:"https://maps.google.com/maps?q=Nature+Retreat+Phetchaburi", booking:"https://www.booking.com/searchresults.th.html?ss=Nature+Retreat+Phetchaburi", type:"hotel" },
  "sand_sea":        { name:"Sand & Sea Resort Cha Am",             image:"", desc:"รีสอร์ทติดหาดทราย สระว่ายน้ำ กิจกรรมทางทะเล บรรยากาศสบาย", nameEn:"Sand and Sea Resort Cha Am", nameZh:"七岩沙滩与海度假村", descEn:"Beachfront resort with pool and water activities, relaxed vibe.", descZh:"海滨度假村，含泳池和水上活动，氛围轻松。", price:"1,100–2,000/คืน", coords:{lat:12.80100,lng:99.96800}, mapsUrl:"https://maps.google.com/maps?q=Sand+Sea+Resort+Cha+Am", booking:"https://www.booking.com/searchresults.th.html?ss=Sand+Sea+Cha+Am",     type:"hotel" },
  "beach_villa":     { name:"Cha Am Beach Villa (กลุ่มใหญ่)",       image:"", desc:"วิลล่าริมหาด เหมาะกลุ่มใหญ่ ครัวส่วนตัว สระว่ายน้ำ 8–12 คน", nameEn:"Cha Am Beach Villa Large Group", nameZh:"七岩海滩大型别墅", descEn:"Beach villa for 8-12 guests, private pool and kitchen.", descZh:"可容纳8-12人的大型海滩别墅，私人泳池和厨房。", price:"2,500–5,000/คืน", coords:{lat:12.80300,lng:99.97200}, mapsUrl:"https://maps.google.com/maps?q=Beach+Villa+Cha+Am", booking:"https://www.booking.com/searchresults.th.html?ss=Beach+Villa+Cha+Am",  type:"hotel" },
  // ══ ที่พักหัวหิน (เพิ่มเติม) ══
  "intercontinental_hh": { name:"InterContinental Hua Hin Resort",  image:"", desc:"รีสอร์ท 5 ดาวหัวหิน วิวทะเลสวยงาม สระว่ายน้ำ สปา อาหารชั้นเลิศ", nameEn:"InterContinental Hua Hin Resort", nameZh:"华欣洲际度假酒店", descEn:"5-star resort in Hua Hin, sea views, infinity pool, world-class spa.", descZh:"华欣五星级度假酒店，海景、无边泳池、顶级水疗。", price:"4,500–12,000/คืน", coords:{lat:12.5645,lng:99.9601}, mapsUrl:"https://maps.google.com/maps?q=InterContinental+Hua+Hin+Resort", booking:"https://www.booking.com/hotel/th/intercontinental-hua-hin-resort.th.html", type:"hotel" },
  "centara_grand_hh":    { name:"Centara Grand Beach Resort Hua Hin", image:"", desc:"รีสอร์ทประวัติศาสตร์เก่าแก่ ติดชายหาดหัวหิน สไตล์โคโลเนียล มีสวนน้ำ", nameEn:"Centara Grand Beach Resort Hua Hin", nameZh:"华欣盛泰乐大海滩度假酒店", descEn:"Historic colonial-style beachfront resort with waterpark. A Hua Hin landmark.", descZh:"华欣地标，历史殖民地风格海滩度假村，配有水上乐园。", price:"4,000–10,000/คืน", coords:{lat:12.5697,lng:99.9618}, mapsUrl:"https://maps.google.com/maps?q=Centara+Grand+Beach+Resort+Hua+Hin", booking:"https://www.booking.com/hotel/th/centara-grand-beach-resort-and-villas-hua-hin.th.html", type:"hotel" },
  "anantara_huahin":     { name:"Anantara Hua Hin Resort",           image:"", desc:"รีสอร์ทสปาหรูหรา สวนดอกไม้สวย สระว่ายน้ำหลายจุด ไม่ไกลจากชะอำ", nameEn:"Anantara Hua Hin Resort", nameZh:"华欣安纳塔拉度假村", descEn:"Luxurious spa resort with beautiful gardens, multiple pools, near Cha-am.", descZh:"豪华水疗度假村，花园优美，多个泳池，近七岩。", price:"3,800–9,000/คืน", coords:{lat:12.5680,lng:99.9590}, mapsUrl:"https://maps.google.com/maps?q=Anantara+Hua+Hin+Resort", booking:"https://www.booking.com/hotel/th/anantara-hua-hin.th.html", type:"hotel" },
  "hilton_huahin":       { name:"Hilton Hua Hin Resort & Spa",       image:"", desc:"โรงแรมหรูใจกลางหัวหิน วิวทะเล สระว่ายน้ำชั้นดาดฟ้า ใกล้ตลาดกลางคืน", nameEn:"Hilton Hua Hin Resort & Spa", nameZh:"华欣希尔顿度假水疗酒店", descEn:"Luxury hotel in central Hua Hin, sea views, rooftop pool, near night market.", descZh:"华欣市中心豪华酒店，海景、屋顶泳池，近夜市。", price:"3,500–8,500/คืน", coords:{lat:12.5712,lng:99.9573}, mapsUrl:"https://maps.google.com/maps?q=Hilton+Hua+Hin+Resort+Spa", booking:"https://www.booking.com/hotel/th/hilton-hua-hin-resort-and-spa.th.html", type:"hotel" },
  "lets_sea_hh":         { name:"Let's Sea Hua Hin Al Fresco Resort", image:"", desc:"รีสอร์ทสไตล์โมเดิร์น วิลล่าริมสระ วิวทะเล อาหารเช้าระดับพรีเมียม", nameEn:"Let's Sea Hua Hin Al Fresco Resort", nameZh:"华欣海边乐园度假村", descEn:"Modern-style resort, pool-view villas, sea views, premium breakfast.", descZh:"现代风格度假村，泳池景别墅，海景，顶级早餐。", price:"3,000–7,000/คืน", coords:{lat:12.5720,lng:99.9580}, mapsUrl:"https://maps.google.com/maps?q=Lets+Sea+Hua+Hin+Al+Fresco+Resort", booking:"https://www.booking.com/hotel/th/let-s-sea-hua-hin-al-fresco-resort.th.html", type:"hotel" },
  "sofitel_huahin":      { name:"Sofitel So Hua Hin",                image:"", desc:"โรงแรมดีไซน์หรูหรา สระว่ายน้ำริมทะเล บาร์ชั้นดาดฟ้า วิวพระอาทิตย์ตก", nameEn:"Sofitel So Hua Hin", nameZh:"华欣索菲特度假酒店", descEn:"Designer luxury hotel, beachside pool, rooftop bar, stunning sunset views.", descZh:"设计感豪华酒店，海边泳池、屋顶酒吧，绝美日落。", price:"3,200–8,000/คืน", coords:{lat:12.5700,lng:99.9600}, mapsUrl:"https://maps.google.com/maps?q=Sofitel+So+Hua+Hin", booking:"https://www.booking.com/hotel/th/sofitel-so-hua-hin.th.html", type:"hotel" },
  "putahracsa_hh":       { name:"Putahracsa Hua Hin",                image:"", desc:"รีสอร์ทบูติคสุดหรู สระว่ายน้ำส่วนตัว วิลล่าริมทะเล บรรยากาศโรแมนติก", nameEn:"Putahracsa Hua Hin", nameZh:"华欣普塔拉克萨精品度假村", descEn:"Ultra-luxurious boutique resort, private pools, beachfront villas, romantic.", descZh:"超豪华精品度假村，私人泳池、海滨别墅，浪漫满分。", price:"5,000–15,000/คืน", coords:{lat:12.5680,lng:99.9575}, mapsUrl:"https://maps.google.com/maps?q=Putahracsa+Hua+Hin", booking:"https://www.booking.com/hotel/th/putahracsa.th.html", type:"hotel" },
  "sheraton_huahin":     { name:"Sheraton Hua Hin Resort & Spa",     image:"", desc:"รีสอร์ทชายหาด 5 ดาว สระว่ายน้ำหลายจุด เทนนิส ฟิตเนส สปา", nameEn:"Sheraton Hua Hin Resort & Spa", nameZh:"华欣喜来登度假水疗酒店", descEn:"5-star beachfront resort, multiple pools, tennis, fitness, and spa.", descZh:"五星级海滩度假村，多泳池、网球、健身和水疗设施。", price:"3,500–9,000/คืน", coords:{lat:12.5660,lng:99.9585}, mapsUrl:"https://maps.google.com/maps?q=Sheraton+Hua+Hin+Resort+Spa", booking:"https://www.booking.com/hotel/th/sheraton-hua-hin-resort-and-spa.th.html", type:"hotel" },
  "hyatt_huahin":        { name:"Hyatt Regency Hua Hin",                image:"", desc:"โรงแรม 5 ดาวหัวหิน สระว่ายน้ำ สปา ร้านอาหารริมทะเล ใกล้ตลาดกลางคืน", nameEn:"Hyatt Regency Hua Hin", nameZh:"华欣凯悦酒店", descEn:"5-star hotel in Hua Hin, pool, spa, seafront restaurant, near night market.", descZh:"华欣五星酒店，泳池、水疗、海边餐厅，近夜市。", price:"2,200–5,000/คืน", coords:{lat:12.5718,lng:99.9581}, mapsUrl:"https://maps.google.com/maps?q=Hyatt+Regency+Hua+Hin", type:"hotel" },
  "la_flora_hh":         { name:"La Flora Resort & Spa Hua Hin",     image:"", desc:"รีสอร์ทสปาหรูหรา สระว่ายน้ำยาว วิวทะเล อาหารไทย อินเตอร์ครบ", nameEn:"La Flora Resort & Spa Hua Hin", nameZh:"华欣拉弗洛拉度假水疗酒店", descEn:"Luxurious spa resort, long pool, sea views, excellent Thai and international food.", descZh:"豪华水疗度假村，长形泳池，海景，泰式和国际餐饮俱全。", price:"2,800–6,500/คืน", coords:{lat:12.5690,lng:99.9595}, mapsUrl:"https://maps.google.com/maps?q=La+Flora+Resort+Spa+Hua+Hin", booking:"https://www.booking.com/hotel/th/la-flora-resort-and-spa-hua-hin.th.html", type:"hotel" },
  "cha_am_boutique": { name:"Cha Am Boutique Hotel",                image:"", desc:"โรงแรมบูติคสไตล์โมเดิร์น ใกล้หาด ออกแบบสวย Instagram-worthy", nameEn:"Cha Am Boutique Hotel", nameZh:"七岩精品酒店", descEn:"Modern boutique hotel near beach, stylish design. Instagram-worthy.", descZh:"海边现代精品酒店，设计时尚，非常上镜。", price:"1,200–2,400/คืน", coords:{lat:12.79600,lng:99.96900}, mapsUrl:"https://maps.google.com/maps?q=Boutique+Hotel+Cha+Am", booking:"https://www.booking.com/searchresults.th.html?ss=Boutique+Hotel+Cha+Am", type:"hotel" },
};

const TYPE_LABEL = { attraction:"🏛️ สถานที่", hotel:"🏨 ที่พัก", restaurant:"🍽️ ร้านอาหาร" };
const TYPE_EMOJI = { attraction:"🏛️", hotel:"🏨", restaurant:"🍽️" };

// ══════════════════════════════════════════════
// FESTIVAL DATA (เพชรบุรีเท่านั้น)
// ══════════════════════════════════════════════
const FESTIVALS = [
  { month:1,  icon:"🎪", highlight:true,
    name:"งานกาชาดเพชรบุรี",
    nameEn:"Phetchaburi Red Cross Fair", nameZh:"碧武里红十字会嘉年华",
    date:"ม.ค. สัปดาห์ที่ 3", dateEn:"3rd week of January", dateZh:"1月第3周",
    location:"สนามกีฬาจังหวัดเพชรบุรี", locationEn:"Phetchaburi Provincial Stadium", locationZh:"碧武里府运动场",
    desc:"งานใหญ่ประจำปี มีการแสดง ร้านค้า อาหาร และกิจกรรมการกุศล จัดโดยสภากาชาดจังหวัด",
    descEn:"Major annual fair with performances, food stalls, and charity activities organized by the provincial Red Cross.",
    descZh:"年度大型嘉年华，有表演、摊位、美食和慈善活动，由省红十字会主办。" },
  { month:2,  icon:"✨", highlight:true,
    name:"งานพระนครคีรี–เดินแสง",
    nameEn:"Phra Nakhon Khiri Festival – Light Walk", nameZh:"帕那空奇里灯光节",
    date:"ก.พ. สัปดาห์ที่ 1", dateEn:"1st week of February", dateZh:"2月第1周",
    location:"พระนครคีรี (เขาวัง)", locationEn:"Phra Nakhon Khiri (Khao Wang)", locationZh:"帕那空奇里（考旺）",
    desc:"แสง สี เสียง อันตระการตาบนเขาวัง วิวสวยที่สุดของปี ชมฟรี ไม่ต้องเสียค่าเข้า",
    descEn:"Spectacular light, color, and sound show on Khao Wang hill. The most beautiful view of the year — free entry!",
    descZh:"考旺山丘上壮观的灯光音响秀，是全年最美的夜景，免费入场！" },
  { month:4,  icon:"💦", highlight:true,
    name:"สงกรานต์เพชรบุรี",
    nameEn:"Phetchaburi Songkran Festival", nameZh:"碧武里宋干节（泼水节）",
    date:"13–15 เม.ย.", dateEn:"13–15 April", dateZh:"4月13–15日",
    location:"ถนนสายหลัก / หาดชะอำ", locationEn:"Main streets / Cha-am Beach", locationZh:"主街道 / 七岩海滩",
    desc:"เล่นน้ำสงกรานต์สไตล์ท้องถิ่น มีขบวนแห่ และกิจกรรมรดน้ำผู้สูงอายุ",
    descEn:"Local-style water festival with parades and traditional elder-blessing ceremonies.",
    descZh:"泰国传统泼水节，有游行和向长辈祈福的传统仪式。" },
  { month:5,  icon:"🕯️", highlight:false,
    name:"วันวิสาขบูชาที่เขาวัง",
    nameEn:"Visakha Bucha at Khao Wang", nameZh:"考旺山佛诞节烛光游行",
    date:"ขึ้น 15 ค่ำ เดือน 6", dateEn:"Full moon of 6th lunar month", dateZh:"农历六月十五",
    location:"พระนครคีรี", locationEn:"Phra Nakhon Khiri", locationZh:"帕那空奇里",
    desc:"เวียนเทียนบนเขาวัง บรรยากาศศักดิ์สิทธิ์ท่ามกลางแสงเทียนนับพัน",
    descEn:"Candlelit procession on Khao Wang hill — a sacred atmosphere among thousands of flickering candles.",
    descZh:"在考旺山上举行烛光绕行仪式，数千支蜡烛营造出庄严神圣的气氛。" },
  { month:7,  icon:"🚣", highlight:false,
    name:"แข่งเรือยาวประเพณีเพชรบุรี",
    nameEn:"Phetchaburi Traditional Longboat Race", nameZh:"碧武里传统龙舟竞赛",
    date:"ก.ค.–ส.ค.", dateEn:"July – August", dateZh:"7–8月",
    location:"แม่น้ำเพชรบุรี", locationEn:"Phetchaburi River", locationZh:"碧武里河",
    desc:"แข่งเรือยาวประเพณีโบราณที่สืบทอดมาหลายร้อยปี มีเรือชิงชนะเลิศ บรรยากาศสนุกสนาน",
    descEn:"Ancient longboat racing tradition passed down for centuries, with exciting competitive races on the river.",
    descZh:"延续数百年的传统龙舟赛，在碧武里河上举行，气氛热烈。" },
  { month:9,  icon:"🥬", highlight:false,
    name:"งานกินเจเพชรบุรี",
    nameEn:"Phetchaburi Vegetarian Festival", nameZh:"碧武里素食节",
    date:"ต.ค. (9 วัน)", dateEn:"October (9 days)", dateZh:"10月（9天）",
    location:"ชุมชนจีน ในเมืองเพชรบุรี", locationEn:"Chinese community, Phetchaburi city", locationZh:"碧武里市华人社区",
    desc:"เดินเที่ยวกินเจ ร้านค้าอาหารมังสวิรัติเปิดทั่วเมือง บรรยากาศคึกคัก",
    descEn:"9-day vegetarian festival with vegan food stalls open throughout the city — vibrant street atmosphere.",
    descZh:"为期9天的素食节，全市素食摊位林立，热闹非凡。" },
  { month:10, icon:"🛶", highlight:false,
    name:"ออกพรรษาแข่งเรือ",
    nameEn:"End of Buddhist Lent Boat Race", nameZh:"佛教安居节结束龙舟赛",
    date:"ขึ้น 15 ค่ำ เดือน 11", dateEn:"Full moon of 11th lunar month", dateZh:"农历十一月十五",
    location:"แม่น้ำเพชรบุรี", locationEn:"Phetchaburi River", locationZh:"碧武里河",
    desc:"ประเพณีออกพรรษาพร้อมการแข่งเรือพายแบบดั้งเดิม",
    descEn:"End-of-Lent ceremony combined with traditional paddle boat racing on the river.",
    descZh:"佛教安居节结束仪式，结合传统划船比赛。" },
  { month:11, icon:"🙏", highlight:false,
    name:"ทอดกฐินเพชรบุรี",
    nameEn:"Phetchaburi Kathin Robe Offering", nameZh:"碧武里献袈裟节",
    date:"พ.ย.", dateEn:"November", dateZh:"11月",
    location:"วัดทั่วจังหวัดเพชรบุรี", locationEn:"Temples across Phetchaburi", locationZh:"碧武里各大寺庙",
    desc:"ทอดกฐินสามัคคีวัดสำคัญในจังหวัด เช่น วัดมหาธาตุ วัดยาง วัดเพชรพลี",
    descEn:"Traditional merit-making ceremony offering robes to monks at major temples like Wat Mahathat and Wat Yang.",
    descZh:"在玛哈泰寺等重要寺庙举行的传统献袈裟积德仪式。" },
  { month:12, icon:"🎆", highlight:true,
    name:"ปีใหม่ชะอำ",
    nameEn:"Cha-am New Year Countdown", nameZh:"七岩海滩新年倒计时",
    date:"31 ธ.ค.–1 ม.ค.", dateEn:"31 Dec – 1 Jan", dateZh:"12月31日–1月1日",
    location:"หาดชะอำ เพชรบุรี", locationEn:"Cha-am Beach, Phetchaburi", locationZh:"碧武里七岩海滩",
    desc:"เคาท์ดาวน์ริมหาด มีคอนเสิร์ต ดอกไม้ไฟ ตลาดกลางคืน บรรยากาศสนุกสนาน",
    descEn:"Beach countdown party with concerts, fireworks, and a night market — welcome the New Year by the sea!",
    descZh:"海滩跨年派对，有演唱会、烟火秀和夜市，在海边迎接新年！" },
];
const MONTH_TH   = ["","ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const MONTH_EN   = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL = ["","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const MONTH_ZH      = ["","1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const MONTH_ZH_FULL = ["","一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];

// ══════════════════════════════════════════════
// ACCOMMODATION DATA (เพชรบุรีเท่านั้น)
// ══════════════════════════════════════════════
const ACCOMMODATIONS = [
  { id:1, type:"homestay", location:"city", price:400, rating:4.2,
    image:"https://images.unsplash.com/photo-1560472355-536de3962603?w=400&q=80",
    mapsUrl:"https://maps.google.com/maps?q=โฮมสเตย์+ริมน้ำเพชร+เพชรบุรี",
    name:"บ้านพักโฮมสเตย์ริมน้ำเพชร", nameEn:"Rim Phet Riverside Homestay", nameZh:"碧武里河畔民宿",
    desc:"บรรยากาศชิลล์ริมแม่น้ำเพชรบุรี อาหารเช้ารวม เจ้าของใจดี",
    descEn:"Relaxing riverside homestay on the Phetchaburi River. Breakfast included, friendly hosts.",
    descZh:"碧武里河畔的惬意民宿，含早餐，房东热情友善。" },
  { id:2, type:"homestay", location:"city", price:500, rating:4.0,
    image:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    mapsUrl:"https://maps.google.com/maps?q=เกสต์เฮ้าส์+ใกล้เขาวัง+เพชรบุรี",
    name:"เกสต์เฮ้าส์ใกล้เขาวัง", nameEn:"Guesthouse near Khao Wang", nameZh:"考旺山附近民宿",
    desc:"เดินถึงเขาวัง 10 นาที ราคาถูก ห้องสะอาด เหมาะนักเดินทาง",
    descEn:"10-minute walk to Khao Wang palace. Affordable, clean rooms, great for backpackers.",
    descZh:"步行10分钟可达考旺宫，价格实惠，房间整洁，适合背包客。" },
  { id:3, type:"hotel", location:"city", price:700, rating:4.0,
    image:"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80",
    mapsUrl:"https://maps.google.com/maps?q=Rim+Phet+Hotel+Phetchaburi",
    name:"โรงแรมริมเพชร", nameEn:"Rim Phet Hotel", nameZh:"碧武里中心酒店",
    desc:"ใจกลางเมืองเพชรบุรี ใกล้ตลาด สะดวกเดินทางไปทุกที่",
    descEn:"Located in the heart of Phetchaburi city, near markets and all major attractions.",
    descZh:"位于碧武里市中心，紧邻市场，出行便利。" },
  { id:4, type:"resort", location:"mountain", price:1200, rating:4.6,
    image:"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    mapsUrl:"https://maps.google.com/maps?q=Kaeng+Krachan+Camp+Resort",
    name:"Kaeng Krachan Camp & Resort", nameEn:"Kaeng Krachan Camp & Resort", nameZh:"凯恩格拉占营地度假村",
    desc:"ติดอุทยานแก่งกระจาน บรรยากาศธรรมชาติ ดูนกยามเช้า ทะเลหมอก",
    descEn:"Adjacent to Kaeng Krachan National Park. Nature vibes, morning birdwatching, sea of mist.",
    descZh:"毗邻凯恩格拉占国家公园，自然氛围浓郁，可早起观鸟、欣赏云海。" },
  { id:5, type:"resort", location:"beach", price:1800, rating:4.3,
    image:"https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&q=80",
    mapsUrl:"https://maps.google.com/maps?q=Regent+Cha+Am+Beach+Resort",
    name:"Regent Cha Am Beach Resort", nameEn:"Regent Cha Am Beach Resort", nameZh:"七岩摄政海滩度假村",
    desc:"รีสอร์ทติดหาดชะอำ สระว่ายน้ำ อาหารเช้าริมหาด วิวทะเลสวยงาม",
    descEn:"Beachfront resort at Cha-am. Pool, breakfast by the sea, stunning ocean views.",
    descZh:"七岩海滩正对面，含泳池和海边早餐，海景壮观。" },
  { id:6, type:"hotel", location:"beach", price:2500, rating:4.4,
    image:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80",
    mapsUrl:"https://maps.google.com/maps?q=Cha+Am+Methavalai+Hotel",
    name:"Cha Am Methavalai Hotel", nameEn:"Cha Am Methavalai Hotel", nameZh:"七岩梅沙瓦莱酒店",
    desc:"โรงแรม 4 ดาวริมหาดชะอำ สิ่งอำนวยความสะดวกครบ เหมาะครอบครัว",
    descEn:"4-star beachfront hotel at Cha-am. Full facilities, perfect for families.",
    descZh:"七岩四星海边酒店，设施齐全，非常适合家庭出行。" },
  { id:7, type:"resort", location:"beach", price:4500, rating:4.8,
    image:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
    mapsUrl:"https://maps.google.com/maps?q=InterContinental+Hua+Hin+Resort",
    name:"InterContinental Hua Hin Resort", nameEn:"InterContinental Hua Hin Resort", nameZh:"华欣洲际度假酒店",
    desc:"รีสอร์ท 5 ดาวหัวหิน วิวทะเล สระอินฟินิตี้ สปาระดับโลก",
    descEn:"5-star Hua Hin resort, sea views, infinity pool, world-class spa.",
    descZh:"华欣五星度假酒店，海景无边泳池，顶级水疗。" },
  { id:8, type:"resort", location:"beach", price:4000, rating:4.8,
    image:"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&q=80",
    mapsUrl:"https://maps.google.com/maps?q=Centara+Grand+Beach+Resort+Hua+Hin",
    name:"Centara Grand Hua Hin", nameEn:"Centara Grand Beach Resort Hua Hin", nameZh:"华欣盛泰乐大海滩度假酒店",
    desc:"รีสอร์ทประวัติศาสตร์สไตล์โคโลเนียล ติดหาดหัวหิน มีสวนน้ำ",
    descEn:"Historic colonial-style beachfront resort with waterpark. Hua Hin landmark.",
    descZh:"华欣地标殖民地风格度假村，配备水上乐园。" },
  { id:9, type:"resort", location:"beach", price:3800, rating:4.7,
    image:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80",
    mapsUrl:"https://maps.google.com/maps?q=Anantara+Hua+Hin+Resort",
    name:"Anantara Hua Hin Resort", nameEn:"Anantara Hua Hin Resort", nameZh:"华欣安纳塔拉度假村",
    desc:"รีสอร์ทสปาหรูหรา สวนดอกไม้สวยงาม สระว่ายน้ำหลายจุด",
    descEn:"Luxurious spa resort with beautiful gardens and multiple pools.",
    descZh:"豪华水疗度假村，花园优美，多个泳池。" },
  { id:10, type:"hotel", location:"beach", price:3500, rating:4.7,
    image:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/e5/e5/da/hilton-hua-hin-resort.jpg?w=1400&h=-1&s=1",
    mapsUrl:"https://maps.google.com/maps?q=Hilton+Hua+Hin+Resort+Spa",
    name:"Hilton Hua Hin Resort & Spa", nameEn:"Hilton Hua Hin Resort & Spa", nameZh:"华欣希尔顿度假水疗酒店",
    desc:"โรงแรมหรูใจกลางหัวหิน วิวทะเล สระชั้นดาดฟ้า ใกล้ตลาดกลางคืน",
    descEn:"Luxury hotel in central Hua Hin, sea views, rooftop pool, near night market.",
    descZh:"华欣市中心豪华酒店，海景屋顶泳池，近夜市。" },
  { id:11, type:"resort", location:"beach", price:3000, rating:4.6,
    image:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/ff/26/6a/let-s-sea-exterior-view.jpg?w=900&h=500&s=1",
    mapsUrl:"https://maps.google.com/maps?q=Lets+Sea+Hua+Hin+Al+Fresco+Resort",
    name:"Let's Sea Hua Hin Al Fresco", nameEn:"Let's Sea Hua Hin Al Fresco Resort", nameZh:"华欣海边乐园度假村",
    desc:"รีสอร์ทโมเดิร์น วิลล่าริมสระ วิวทะเล อาหารเช้าพรีเมียม",
    descEn:"Modern resort, pool-view villas, sea views, premium breakfast.",
    descZh:"现代度假村，泳池景别墅，海景，顶级早餐。" },
  { id:12, type:"hotel", location:"beach", price:2200, rating:4.5,
    image:"https://static.prod.r53.tablethotels.com/media/hotels/slideshow_images_staged/large/1067991.jpg",
    mapsUrl:"https://maps.google.com/maps?q=Hyatt+Regency+Hua+Hin",
    name:"Hyatt Regency Hua Hin", nameEn:"Hyatt Regency Hua Hin", nameZh:"华欣凯悦酒店",
    desc:"โรงแรม 5 ดาวหัวหิน สระว่ายน้ำกลางแจ้ง สปา ร้านอาหารริมทะเล ใกล้ตลาดกลางคืน",
    descEn:"5-star hotel in Hua Hin with outdoor pool, spa, and seafront restaurant near the night market.",
    descZh:"华欣五星酒店，户外泳池、水疗和海边餐厅，靠近夜市。" },
  { id:13, type:"resort", location:"beach", price:5000, rating:4.9,
    image:"https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80",
    mapsUrl:"https://maps.google.com/maps?q=Putahracsa+Hua+Hin",
    name:"Putahracsa Hua Hin", nameEn:"Putahracsa Hua Hin", nameZh:"华欣普塔拉克萨精品度假村",
    desc:"รีสอร์ทบูติคสุดหรู สระส่วนตัว วิลล่าริมทะเล โรแมนติกมาก",
    descEn:"Ultra-luxurious boutique resort, private pools, beachfront villas, ultra-romantic.",
    descZh:"超豪华精品度假村，私人泳池，海滨别墅，极致浪漫。" },
];

// ══════════════════════════════════════════════
// FAQ LOGGER (localStorage)
// ══════════════════════════════════════════════
const FAQ_KEY     = "phet_faq_log";
const SESSION_KEY = "phet_sessions";

function logQuery(query) {
  try {
    const log = JSON.parse(localStorage.getItem(FAQ_KEY) || "[]");
    const ex  = log.find(i => i.query.toLowerCase() === query.toLowerCase());
    if (ex) { ex.count++; ex.last = new Date().toISOString(); }
    else log.push({ query, count:1, first:new Date().toISOString(), last:new Date().toISOString() });
    localStorage.setItem(FAQ_KEY, JSON.stringify(log));
  } catch(e) {}
}
function getTopFAQ(n=20) {
  try { return (JSON.parse(localStorage.getItem(FAQ_KEY)||"[]")).sort((a,b)=>b.count-a.count).slice(0,n); }
  catch(e) { return []; }
}

// ══════════════════════════════════════════════
// SESSION HISTORY (localStorage)
// ══════════════════════════════════════════════
function saveSession(id, messages) {
  if (messages.length <= 1) return;
  try {
    const sessions = JSON.parse(localStorage.getItem(SESSION_KEY) || "[]");
    const firstUser = messages.find(m => m.role === "user");
    const title = firstUser ? firstUser.text.slice(0,35)+(firstUser.text.length>35?"...":"") : "บทสนทนา";
    const idx = sessions.findIndex(s => s.id === id);
    const entry = { id, title, messages, savedAt:new Date().toISOString(), starred:false };
    if (idx >= 0) sessions[idx] = entry; else sessions.unshift(entry);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessions.slice(0,20)));
  } catch(e) {}
}
function loadSessions() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)||"[]"); } catch(e) { return []; }
}
function toggleStar(id) {
  try {
    const sessions = JSON.parse(localStorage.getItem(SESSION_KEY)||"[]");
    const idx = sessions.findIndex(s=>s.id===id);
    if (idx>=0) { sessions[idx].starred=!sessions[idx].starred; localStorage.setItem(SESSION_KEY,JSON.stringify(sessions)); }
  } catch(e) {}
}
function deleteSession(id) {
  try {
    const sessions = JSON.parse(localStorage.getItem(SESSION_KEY)||"[]");
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessions.filter(s=>s.id!==id)));
  } catch(e) {}
}

// ══════════════════════════════════════════════
// LANGUAGES
// ══════════════════════════════════════════════
const LANGS = {
  th: {
    code:"th", label:"🇹🇭 ไทย",
    placeholder:"ถามน้องเพชรเรื่องเพชรบุรี–หัวหิน...",
    welcome:"สวัสดีค่ะ! ฉันคือ **น้องเพชร** 💜 ไกด์ท่องเที่ยว AI เพชรบุรี–หัวหิน ✨\n\nอยากรู้เรื่องที่เที่ยว 🏛️ ของกินอร่อย 🍽️ ที่พัก 🏨 การเดินทาง 🚗 ความปลอดภัย 🛡️ หรือวัฒนธรรม 🎎 ถามได้เลยนะคะ!",
    newChat:"แชทใหม่", errorMsg:"❌ เกิดข้อผิดพลาด กรุณาตรวจสอบ Server และลองใหม่นะคะ",
    quotaMsg:"⚠️ ขณะนี้ AI ให้บริการเกินโควต้าต่อวันแล้วค่ะ 😔\n\nกรุณาลองใหม่อีกครั้งในวันพรุ่งนี้ค่ะ 🙏",
    plannerTab:"จัดทริป", chatTab:"แชท",
    plannerTitle:"วางแผนทริปเพชรบุรี", plannerSubtitle:"บอกความต้องการ แล้วปล่อยให้ AI จัดแผนให้!",
    days:"จำนวนวัน", interests:"ความสนใจ", travelWith:"เดินทางกับ",
    generateBtn:"✨ สร้างแผนทริป", generating:"⏳ กำลังวางแผน...",
    interestOptions:["🏔️ ภูเขา/ป่า","🏖️ ทะเล/ชายหาด","🏛️ ประวัติศาสตร์","🍽️ อาหาร/ของฝาก","🌅 พระอาทิตย์ตก","🦜 ดูนก"],
    travelOptions:["คนเดียว","คู่รัก","ครอบครัว","เพื่อนกลุ่ม"],
    quickMenu:[
      {icon:"🏛️",label:"ที่เที่ยวแนะนำ",msg:"แนะนำสถานที่ท่องเที่ยวในเพชรบุรีและหัวหิน มีที่ไหนน่าไปบ้าง?"},
      {icon:"🍜",label:"ของกินยอดนิยม",msg:"ของกินยอดนิยมและร้านอาหารแนะนำในเพชรบุรี–หัวหิน"},
      {icon:"🚌",label:"เดินทางยังไง",msg:"วิธีเดินทางจากกรุงเทพไปเพชรบุรีและหัวหิน มีกี่ทาง?"},
      {icon:"🌤️",label:"ช่วงไหนดีที่สุด",msg:"ช่วงเวลาที่เหมาะสมที่สุดในการท่องเที่ยวเพชรบุรีและหัวหิน"},
      {icon:"📸",label:"สถานที่ถ่ายรูป",msg:"แนะนำจุดถ่ายรูปยอดนิยมและ check-in สวยๆ ในเพชรบุรี–หัวหิน"},
      {icon:"🏨",label:"ที่พักแนะนำ",msg:"แนะนำที่พักในเพชรบุรีและหัวหินตามงบประมาณ"},
      {icon:"🎭",label:"กิจกรรม",msg:"กิจกรรมท่องเที่ยวน่าสนใจในเพชรบุรีและหัวหินมีอะไรบ้าง?"},
      {icon:"🎪",label:"เทศกาล",msg:"เทศกาลและงานประจำปีในเพชรบุรีและหัวหิน"},
      {icon:"💰",label:"คำนวณงบ",msg:"ช่วยประมาณค่าใช้จ่ายท่องเที่ยวเพชรบุรี–หัวหิน 2 วัน 1 คืน"},
      {icon:"🚨",label:"เบอร์ฉุกเฉิน",msg:"เบอร์โทรฉุกเฉินและตำรวจท่องเที่ยวในเพชรบุรีและหัวหิน"},
    ],
    sidebarItems:[
      {icon:"🏛️",label:"สถานที่ท่องเที่ยว",msg:"แนะนำสถานที่ท่องเที่ยวทั้งหมดในเพชรบุรี"},
      {icon:"🍽️",label:"ร้านอาหาร",msg:"แนะนำร้านอาหารยอดนิยมในเพชรบุรี"},
      {icon:"🌤️",label:"ฤดูกาลท่องเที่ยว",msg:"ช่วงเวลาที่เหมาะสมในการท่องเที่ยวเพชรบุรีคือเมื่อไหร่?"},
      {icon:"🚌",label:"การเดินทาง",msg:"วิธีเดินทางจากกรุงเทพไปเพชรบุรีมีอะไรบ้าง?"},
      {icon:"🏕️",label:"แก่งกระจาน",msg:"อุทยานแห่งชาติแก่งกระจานมีอะไรน่าสนใจบ้าง?"},
      {icon:"🍮",label:"ขนมหม้อแกง",msg:"ขนมหม้อแกงเพชรบุรี ราคาเท่าไหร่ ซื้อได้ที่ไหน?"},
    ],
    suggestions:["🏛️ ที่เที่ยวแนะนำ?","🍜 ของกินยอดนิยม?","🚌 เดินทางยังไง?","🌤️ ช่วงไหนดีที่สุด?"],
    showMenu:"แสดงเมนูด่วน", hideMenu:"ซ่อนเมนูด่วน", directions:"นำทาง", mapView:"แผนที่",
  },
  en: {
    code:"en", label:"🇬🇧 EN",
    placeholder:"Ask about Phetchaburi...",
    welcome:"Hello! I'm **Nong Phet** 💜 — your AI travel guide for Phetchaburi & Hua Hin! ✨\n\nAsk me about attractions 🏛️, food 🍽️, accommodation 🏨, transport 🚗, safety 🛡️ or culture 🎎!",
    newChat:"New Chat", errorMsg:"❌ An error occurred. Please check the server and try again.",
    quotaMsg:"⚠️ AI service has reached its daily quota limit 😔\n\nPlease try again tomorrow 🙏",
    plannerTab:"Plan Trip", chatTab:"Chat",
    plannerTitle:"Plan Your Phetchaburi Trip", plannerSubtitle:"Tell us your preferences and let AI plan for you!",
    days:"Days", interests:"Interests", travelWith:"Travelling With",
    generateBtn:"✨ Generate Itinerary", generating:"⏳ Planning...",
    interestOptions:["🏔️ Mountain/Forest","🏖️ Beach/Sea","🏛️ History","🍽️ Food/Souvenirs","🌅 Sunset","🦜 Birdwatching"],
    travelOptions:["Solo","Couple","Family","Friends"],
    quickMenu:[
      {icon:"🏛️",label:"Attractions",msg:"Top tourist attractions in Phetchaburi & Hua Hin"},
      {icon:"🍜",label:"Popular Food",msg:"Must-eat food and restaurants in Phetchaburi & Hua Hin"},
      {icon:"🚌",label:"Getting There",msg:"How to travel from Bangkok to Phetchaburi or Hua Hin?"},
      {icon:"🌤️",label:"Best Season",msg:"Best time of year to visit Phetchaburi and Hua Hin"},
      {icon:"📸",label:"Photo Spots",msg:"Best photography spots and check-in points in Phetchaburi–Hua Hin"},
      {icon:"🏨",label:"Accommodation",msg:"Hotel and resort recommendations in Phetchaburi & Hua Hin by budget"},
      {icon:"🎭",label:"Activities",msg:"Best activities and things to do in Phetchaburi & Hua Hin"},
      {icon:"🎪",label:"Festivals",msg:"Annual festivals and events in Phetchaburi and Hua Hin"},
      {icon:"💰",label:"Budget",msg:"Help me estimate travel costs for 2 days in Phetchaburi–Hua Hin"},
      {icon:"🚨",label:"Emergency",msg:"Emergency numbers and tourist police contacts in Phetchaburi and Hua Hin"},
    ],
    sidebarItems:[
      {icon:"🏛️",label:"Attractions",msg:"All tourist attractions in Phetchaburi"},
      {icon:"🍽️",label:"Restaurants",msg:"Top restaurants in Phetchaburi"},
      {icon:"🌤️",label:"Best Season",msg:"Best time to visit Phetchaburi?"},
      {icon:"🚌",label:"Transport",msg:"How to get from Bangkok to Phetchaburi?"},
      {icon:"🏕️",label:"Kaeng Krachan",msg:"What's great about Kaeng Krachan National Park?"},
      {icon:"🍮",label:"Khanom Mo Kaeng",msg:"What is Khanom Mo Kaeng and where to buy it?"},
    ],
    suggestions:["🏛️ Top attractions?","🍜 Popular food?","🚌 Getting there?","🌤️ Best season?"],
    showMenu:"Show Quick Menu", hideMenu:"Hide Quick Menu", directions:"Navigate", mapView:"Map",
  },
  zh: {
    code:"zh", label:"🇨🇳 中文",
    placeholder:"询问碧武里旅游...",
    welcome:"您好！我是 **小碧** 💜 碧武里&华欣AI旅游小助手！✨\n\n可以问我景点 🏛️、美食 🍽️、住宿 🏨、交通 🚗、安全 🛡️ 或文化礼仪 🎎！",
    newChat:"新对话", errorMsg:"❌ 发生错误，请检查服务器后重试。",
    quotaMsg:"⚠️ AI服务已达到每日配额限制 😔\n\n请明天再试 🙏",
    plannerTab:"行程规划", chatTab:"聊天",
    plannerTitle:"碧武里行程规划", plannerSubtitle:"告诉我们您的需求，让AI为您规划！",
    days:"天数", interests:"兴趣", travelWith:"出行方式",
    generateBtn:"✨ 生成行程", generating:"⏳ 规划中...",
    interestOptions:["🏔️ 山/森林","🏖️ 海滩","🏛️ 历史","🍽️ 美食/纪念品","🌅 日落","🦜 观鸟"],
    travelOptions:["独行","情侣","家庭","朋友"],
    quickMenu:[
      {icon:"🏛️",label:"推荐景点",msg:"碧武里和华欣有哪些值得一游的旅游景点？"},
      {icon:"🍜",label:"热门美食",msg:"碧武里和华欣最受欢迎的美食和餐厅推荐"},
      {icon:"🚌",label:"如何到达",msg:"从曼谷到碧武里和华欣有哪些交通方式？"},
      {icon:"🌤️",label:"最佳旅游时间",msg:"碧武里和华欣最佳旅游季节是什么时候？"},
      {icon:"📸",label:"拍照景点",msg:"碧武里和华欣最适合打卡拍照的地点有哪些？"},
      {icon:"🏨",label:"住宿推荐",msg:"按预算推荐碧武里和华欣的酒店住宿"},
      {icon:"🎭",label:"旅游活动",msg:"碧武里和华欣有哪些特色旅游活动？"},
      {icon:"🎪",label:"节日活动",msg:"碧武里和华欣有哪些年度节庆活动？"},
      {icon:"💰",label:"旅游预算",msg:"帮我估算1人在碧武里和华欣游玩2天的费用"},
      {icon:"🚨",label:"紧急联系",msg:"碧武里和华欣的紧急求助电话和旅游警察联系方式"},
    ],
    sidebarItems:[
      {icon:"🏛️",label:"所有景点",msg:"碧武里所有旅游景点介绍"},
      {icon:"🍽️",label:"餐厅推荐",msg:"碧武里热门餐厅推荐"},
      {icon:"🌤️",label:"最佳季节",msg:"碧武里最佳旅游时间是什么时候？"},
      {icon:"🚌",label:"交通方式",msg:"从曼谷到碧武里怎么去？"},
      {icon:"🏕️",label:"凯恩格拉占",msg:"凯恩格拉占国家公园有什么特色？"},
      {icon:"🍮",label:"椰奶蛋糕",msg:"碧武里椰奶蛋糕在哪里买？多少钱？"},
    ],
    suggestions:["🏛️ 推荐景点？","🍜 热门美食？","🚌 怎么去？","🌤️ 最佳季节？"],
    showMenu:"显示快捷菜单", hideMenu:"隐藏快捷菜单", directions:"导航", mapView:"地图",
  },
};

function isNightTime() { const h = new Date().getHours(); return h >= 18 || h < 6; }
const L$ = (lang,th,en,zh) => lang==="th"?th:lang==="en"?en:zh;

// ══════════════════════════════════════════════
// PARSE CONTENT (markdown + place cards + compare)
// ══════════════════════════════════════════════
function parseContent(text) {
  const cardRegex = /<PLACE_CARD>({.*?})<\/PLACE_CARD>/g;
  const cards = [];
  let match;
  while ((match = cardRegex.exec(text)) !== null) {
    try { cards.push(JSON.parse(match[1])); } catch(e) {}
  }
  const compareMatch = text.match(/<COMPARE_TABLE>([\s\S]*?)<\/COMPARE_TABLE>/);
  let compareData = null;
  if (compareMatch) { try { compareData = JSON.parse(compareMatch[1]); } catch(e) {} }

  const cleanText = text
    .replace(/<PLACE_CARD>.*?<\/PLACE_CARD>/g,"")
    .replace(/<COMPARE_TABLE>[\s\S]*?<\/COMPARE_TABLE>/g,"")
    .trim();
  const html = cleanText
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/### (.+)/g,"<h4>$1</h4>")
    .replace(/## (.+)/g,"<h3>$1</h3>")
    .replace(/\n/g,"<br/>");
  return { html, cards, compareData };
}

// ══════════════════════════════════════════════
// FEATURE 1: PLACE CARD (with GPS navigation)
// ══════════════════════════════════════════════
function PlaceCard({ placeKey, lang }) {
  const L = LANGS[lang];
  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 2800); };
  const place = PLACES_DB[placeKey];
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  if (!place) return null;

  const openNavigate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const url = `https://www.google.com/maps/dir/?api=1&origin=${pos.coords.latitude},${pos.coords.longitude}&destination=${place.coords.lat},${place.coords.lng}&travelmode=driving`;
          window.open(url,"_blank");
        },
        () => window.open(place.mapsUrl||`https://www.google.com/maps/dir/?api=1&destination=${place.coords.lat},${place.coords.lng}`,"_blank")
      );
    } else {
      window.open(place.mapsUrl||`https://www.google.com/maps/dir/?api=1&destination=${place.coords.lat},${place.coords.lng}`,"_blank");
    }
  };

  const openMapView = () => {
    // Use real mapsUrl (shows place page with reviews/prices) or fallback to coords
    const url = place.mapsUrl && place.mapsUrl !== "https://maps.app.goo.gl/"
      ? place.mapsUrl
      : `https://www.google.com/maps/search/?api=1&query=${place.coords.lat},${place.coords.lng}`;
    window.open(url,"_blank");
  };

  return (
    <div className="place-card">
      <div className="place-card-img-wrap">
        {!imgError ? (
          <img src={place.image} alt={place.name}
            className={`place-card-img ${imgLoaded?"loaded":""}`}
            onLoad={()=>setImgLoaded(true)} onError={()=>setImgError(true)}/>
        ) : (
          <div className="place-card-img-fallback">{TYPE_EMOJI[place.type]||"📍"}</div>
        )}
        <span className="place-card-type">{lang==="zh"?{"attraction":"🏛️ 景点","hotel":"🏨 住宿","restaurant":"🍽️ 餐厅"}[place.type]:lang==="en"?{"attraction":"🏛️ Attraction","hotel":"🏨 Hotel","restaurant":"🍽️ Restaurant"}[place.type]:TYPE_LABEL[place.type]||place.type}</span>
      </div>
      <div className="place-card-body">
        <h4 className="place-card-name">{lang==="zh"?(place.nameZh||place.name):lang==="en"?(place.nameEn||place.name):place.name}</h4>
        <p className="place-card-desc">{lang==="zh"?(place.descZh||place.desc):lang==="en"?(place.descEn||place.desc):place.desc}</p>
        <div className="place-card-price">💰 {lang==="zh"?(place.price||"").replace("ฟรี","免费").replace("บาท","泰铢"):lang==="en"?(place.price||"").replace("ฟรี","Free").replace("บาท","THB"):place.price}</div>
        <div className="place-card-actions">
          <button onClick={openMapView} className="place-card-btn view-btn">🗺️ {L.mapView}</button>
        </div>
      </div>
    </div>

  );
}

// ══════════════════════════════════════════════
// FEATURE 5: COMPARE TABLE
// ══════════════════════════════════════════════
function CompareTable({ data, lang }) {
  if (!data?.items || !data?.rows) return null;
  return (
    <div className="compare-table-wrap">
      <div className="compare-title">
        ⚖️ {L$("th","เปรียบเทียบ","Compare","对比")} : {data.items.map(i=>i.name).join(" vs ")}
      </div>
      <div className="compare-table">
        <div className="compare-header">
          <div className="compare-cell head-cell">{L$(lang,"หัวข้อ","Category","类别")}</div>
          {data.items.map((item,i)=><div key={i} className="compare-cell head-cell item-head">{item.name}</div>)}
        </div>
        {data.rows.map((row,ri)=>(
          <div key={ri} className={`compare-row ${ri%2===0?"even":"odd"}`}>
            <div className="compare-cell row-label">{row.label}</div>
            {row.values.map((val,vi)=>(
              <div key={vi} className={`compare-cell row-val ${row.highlight===vi?"highlighted":""}`}>{val}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// TYPING INDICATOR
// ══════════════════════════════════════════════
function TypingIndicator() {
  return (
    <div className="message bot-message typing">
      <div className="msg-avatar bot-avatar"><img src={PHETBOT_LOGO} alt="น้องเพชร"/></div>
      <div className="bubble"><span className="dot"/><span className="dot"/><span className="dot"/></div>
    </div>
  );
}

// ══════════════════════════════════════════════
// MESSAGE
// ══════════════════════════════════════════════
function Message({ msg, lang }) {
  const { html, cards, compareData } = parseContent(msg.text);
  return (
    <div className={`message ${msg.role==="user"?"user-message":"bot-message"}`}>
      {msg.role==="bot" && <div className="msg-avatar">{msg.isQuota?"⚠️":""}</div>}
      <div className="msg-content">
        <div className={`bubble ${msg.isQuota?"quota-bubble":""}`} dangerouslySetInnerHTML={{__html:html}}/>
        {compareData && <CompareTable data={compareData} lang={lang}/>}
        {cards.length>0 && (
          <div className="place-cards-row">
            {cards.map((c,i)=><PlaceCard key={i} placeKey={c.key} lang={lang}/>)}
          </div>
        )}
      </div>
      {msg.role==="user" && <div className="msg-avatar user-avatar">👤</div>}
    </div>
  );
}

// ══════════════════════════════════════════════
// FEATURE 2: FESTIVAL CALENDAR
// ══════════════════════════════════════════════
function FestivalCalendar({ lang }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedFest, setSelectedFest]   = useState(null);
  const [filter, setFilter] = useState("all");
  const curMonth = new Date().getMonth()+1;

  const filtered = FESTIVALS.filter(f => {
    if (filter==="thismonth") return f.month===curMonth;
    if (filter==="highlight") return f.highlight;
    if (filter==="songkran")  return f.month===4;
    if (filter==="newyear")   return f.month===12;
    return true;
  });

  return (
    <div className="festival-page">
      <div className="festival-inner">
        <div className="festival-hero">
          <h2>🎪 {L$(lang,"เทศกาลและงานประจำปีเพชรบุรี","Phetchaburi Festival Calendar","碧武里节庆日历")}</h2>
          <p>{L$(lang,"กิจกรรมประจำปีทั้งหมดในจังหวัดเพชรบุรี","Annual events & festivals in Phetchaburi province","碧武里省全年活动")}</p>
        </div>
        <div className="festival-filters">
          {[
            {key:"all",       icon:"📅", th:"ทั้งปี",   en:"All Year",     zh:"全年"},
            {key:"thismonth", icon:"📌", th:"เดือนนี้", en:"This Month",   zh:"本月"},
            {key:"highlight", icon:"⭐", th:"งานใหญ่",  en:"Major Events", zh:"重大活动"},
            {key:"songkran",  icon:"💦", th:"สงกรานต์", en:"Songkran",     zh:"宋干节"},
            {key:"newyear",   icon:"🎆", th:"ปีใหม่",   en:"New Year",     zh:"新年"},
          ].map(f=>(
            <button key={f.key} className={`festival-filter-btn ${filter===f.key?"active":""}`} onClick={()=>setFilter(f.key)}>
              {f.icon} {L$(lang,f.th,f.en,f.zh)}
            </button>
          ))}
        </div>
        <div className="calendar-grid">
          {Array.from({length:12},(_,i)=>i+1).map(month=>{
            const events = filtered.filter(f=>f.month===month);
            return (
              <div key={month}
                className={`calendar-month ${events.length>0?"has-events":""} ${month===curMonth?"current-month":""} ${selectedMonth===month?"selected":""}`}
                onClick={()=>setSelectedMonth(selectedMonth===month?null:month)}>
                <div className="calendar-month-label">
                  {lang==="zh"?MONTH_ZH[month]:lang==="en"?MONTH_EN[month]:MONTH_TH[month]}
                  {month===curMonth&&<span className="now-badge">{L$(lang,"ตอนนี้","Now","当前")}</span>}
                </div>
                <div className="calendar-events-preview">
                  {events.length===0
                    ? <span className="no-event">–</span>
                    : events.map((e,i)=>(
                        <div key={i} className={`event-dot ${e.highlight?"highlight":""}`}>
                          <span>{e.icon}</span><span className="event-dot-name">{lang==="zh"?e.nameZh:lang==="en"?e.nameEn:e.name}</span>
                        </div>
                      ))
                  }
                </div>
                {events.length>0&&<div className="event-count">{events.length} {L$(lang,"งาน","event","活动")}</div>}
              </div>
            );
          })}
        </div>
        {selectedMonth&&(
          <div className="month-detail">
            <div className="month-detail-title">
              {lang==="zh"?MONTH_ZH_FULL[selectedMonth]:lang==="en"?MONTH_EN[selectedMonth]:MONTH_FULL[selectedMonth]} — {filtered.filter(f=>f.month===selectedMonth).length} {L$(lang,"งาน","event","活动")}
            </div>
            <div className="festival-cards">
              {filtered.filter(f=>f.month===selectedMonth).map((fest,i)=>(
                <div key={i} className={`festival-card ${fest.highlight?"highlight":""}`} onClick={()=>setSelectedFest(fest)}>
                  <div className="festival-card-icon">{fest.icon}</div>
                  <div className="festival-card-body">
                    <div className="festival-card-name">{lang==="zh"?fest.nameZh:lang==="en"?fest.nameEn:fest.name}</div>
                    <div className="festival-card-date">📅 {lang==="zh"?fest.dateZh:lang==="en"?fest.dateEn:fest.date}</div>
                    <div className="festival-card-location">📍 {lang==="zh"?fest.locationZh:lang==="en"?fest.locationEn:fest.location}</div>
                  </div>
                  {fest.highlight&&<span className="highlight-badge">⭐ {L$(lang,"งานใหญ่","Major","重要")}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {selectedFest&&(
        <div className="festival-modal-overlay" onClick={()=>setSelectedFest(null)}>
          <div className="festival-modal" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setSelectedFest(null)}>✕</button>
            <div className="modal-icon">{selectedFest.icon}</div>
            <h3 className="modal-title">{lang==="zh"?selectedFest.nameZh:lang==="en"?selectedFest.nameEn:selectedFest.name}</h3>
            <div className="modal-info">
              <div>📅 <strong>{L$(lang,"วันที่","Date","日期")}:</strong> {lang==="zh"?selectedFest.dateZh:lang==="en"?selectedFest.dateEn:selectedFest.date}</div>
              <div>📍 <strong>{L$(lang,"สถานที่","Location","地点")}:</strong> {lang==="zh"?selectedFest.locationZh:lang==="en"?selectedFest.locationEn:selectedFest.location}</div>
            </div>
            <p className="modal-desc">{lang==="zh"?selectedFest.descZh:lang==="en"?selectedFest.descEn:selectedFest.desc}</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFest.location+"+เพชรบุรี")}`}
              target="_blank" rel="noreferrer" className="modal-map-btn">
              🗺️ {L$(lang,"ดูสถานที่บนแผนที่","View on Maps","在地图上查看")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// FEATURE 3: ADMIN DASHBOARD
// ══════════════════════════════════════════════
function AdminDashboard({ onClose }) {
  const ADMIN_PASS = "phet2024";
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [faqs, setFaqs] = useState([]);
  useEffect(()=>{ if(authed) setFaqs(getTopFAQ(20)); },[authed]);
  const total = faqs.reduce((s,i)=>s+i.count,0);

  if (!authed) return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-login" onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="admin-login-icon">🔐</div>
        <h3 className="admin-login-title">Admin Dashboard</h3>
        <p className="admin-login-sub">กรอกรหัสผ่านเพื่อเข้าใช้งาน</p>
        <input
          type="password" className={`admin-pass-input ${passError?"error":""}`}
          placeholder="รหัสผ่าน..." value={passInput}
          onChange={e=>{setPassInput(e.target.value);setPassError(false);}}
          onKeyDown={e=>{ if(e.key==="Enter"){ if(passInput===ADMIN_PASS) setAuthed(true); else setPassError(true); }}}
          autoFocus/>
        {passError && <div className="admin-pass-error">❌ รหัสผ่านไม่ถูกต้อง</div>}
        <button className="admin-login-btn" onClick={()=>{ if(passInput===ADMIN_PASS) setAuthed(true); else setPassError(true); }}>
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );

  const exportPDF = () => {
    const faqData = getTopFAQ(50);
    const total   = faqData.reduce((s,i)=>s+i.count, 0);
    const rows    = faqData.map((item,i)=>`
      <tr style="background:${i%2===0?'#fff':'#f5fff8'}">
        <td style="padding:8px 14px;border-bottom:1px solid #e0f0e6;color:#999;text-align:center">${i+1}</td>
        <td style="padding:8px 14px;border-bottom:1px solid #e0f0e6;color:#1a2e1a">${item.query.replace(/</g,'&lt;')}</td>
        <td style="padding:8px 14px;border-bottom:1px solid #ede9fe;font-weight:700;color:#7c3aed;text-align:center">${item.count}</td>
        <td style="padding:8px 14px;border-bottom:1px solid #e0f0e6;font-size:0.8rem;color:#666;text-align:center">${new Date(item.last).toLocaleDateString('th-TH')}</td>
      </tr>`).join('');
    const html = `<!DOCTYPE html><html lang="th"><head>
      <meta charset="UTF-8">
      <title>FAQ Dashboard — น้องเพชร</title>
      <style>
        body{font-family:'Sarabun',sans-serif;padding:32px 40px;color:#1a2e1a;font-size:14px}
        h1{color:#7c3aed;font-size:1.6rem;margin-bottom:4px}
        .sub{color:#666;font-size:0.85rem;margin-bottom:20px}
        .stats{display:flex;gap:16px;margin-bottom:24px}
        .stat{background:#f0faf4;border-radius:10px;padding:14px 22px;text-align:center;border:1px solid #c8e6c9}
        .stat-n{font-size:2rem;font-weight:700;color:#7c3aed;line-height:1}
        .stat-l{font-size:0.72rem;color:#666;margin-top:4px}
        table{width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;box-shadow:0 1px 8px rgba(30,77,53,0.08)}
        thead tr{background:#7c3aed;color:white}
        th{padding:10px 14px;text-align:left;font-size:0.85rem;font-weight:700}
        .footer{margin-top:20px;font-size:0.75rem;color:#999;text-align:center}
        @media print{body{padding:16px}}
      </style>
    </head><body>
      <h1>📊 FAQ Dashboard — น้องเพชร</h1>
      <div class="sub">Generated: ${new Date().toLocaleString('th-TH')} · ทั้งหมด ${faqData.length} คำถาม</div>
      <div class="stats">
        <div class="stat"><div class="stat-n">${total}</div><div class="stat-l">จำนวน queries ทั้งหมด</div></div>
        <div class="stat"><div class="stat-n">${faqData.length}</div><div class="stat-l">คำถามที่ไม่ซ้ำ</div></div>
        <div class="stat"><div class="stat-n">${faqData[0]?.count||0}</div><div class="stat-l">สูงสุด (ครั้ง)</div></div>
      </div>
      <table>
        <thead><tr><th style="width:40px">#</th><th>คำถาม</th><th style="width:70px;text-align:center">ครั้ง</th><th style="width:110px;text-align:center">ล่าสุด</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">น้องเพชร — AI Travel Guide for Phetchaburi & Hua Hin</div>
    </body></html>`;
    const win = window.open('','_blank','width=900,height=700');
    if (!win) { alert('กรุณาอนุญาต popup แล้วลองใหม่'); return; }
    win.document.write(html);
    win.document.close();
    win.addEventListener('load', ()=>{ win.focus(); win.print(); });
  };

  const exportCSV = () => {
    const log = JSON.parse(localStorage.getItem(FAQ_KEY)||"[]").sort((a,b)=>b.count-a.count);
    const csv = "Query,Count,First Asked,Last Asked\n"+log.map(i=>`"${i.query.replace(/"/g,'""')}",${i.count},${i.first},${i.last}`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"}));
    a.download = `phetchaburi_faq_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={e=>e.stopPropagation()}>
        <div className="admin-header">
          <h3>📊 Admin — FAQ Dashboard</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-stats">
          <div className="admin-stat"><div className="admin-stat-num">{total}</div><div className="admin-stat-label">Total Queries</div></div>
          <div className="admin-stat"><div className="admin-stat-num">{faqs.length}</div><div className="admin-stat-label">Unique Questions</div></div>
          <div className="admin-stat"><div className="admin-stat-num">{faqs[0]?.count||0}</div><div className="admin-stat-label">Top Count</div></div>
        </div>
        <div className="admin-section-title">🔥 Top 5 Most Asked</div>
        <div className="faq-list">
          {faqs.slice(0,5).map((item,i)=>(
            <div key={i} className="faq-row">
              <span className="faq-rank">#{i+1}</span>
              <span className="faq-query">{item.query}</span>
              <div className="faq-bar-wrap"><div className="faq-bar" style={{width:`${Math.min((item.count/(faqs[0]?.count||1))*100,100)}%`}}/></div>
              <span className="faq-count">{item.count}x</span>
            </div>
          ))}
          {faqs.length===0&&<div className="faq-empty">ยังไม่มีข้อมูล — เริ่มแชทก่อนนะครับ</div>}
        </div>
        {faqs.length>5&&(
          <>
            <div className="admin-section-title" style={{marginTop:16}}>📋 All Questions</div>
            <div className="faq-all">
              {faqs.map((item,i)=>(
                <div key={i} className="faq-all-row">
                  <span className="faq-all-query">{item.query}</span>
                  <span className="faq-all-count">{item.count}x</span>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="admin-actions">
          <button className="admin-export-btn" onClick={exportCSV}>📥 CSV</button>
          <button className="admin-export-btn admin-pdf-btn" onClick={exportPDF}>🖨️ PDF</button>
          <button className="admin-clear-btn" onClick={()=>{if(confirm("ล้างข้อมูลทั้งหมด?")){localStorage.removeItem(FAQ_KEY);setFaqs([]);}}}>🗑️ Clear</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// FEATURE 4: ACCOMMODATION FILTER
// ══════════════════════════════════════════════
function AccomFilter({ lang }) {
  const [maxPrice, setMaxPrice]       = useState(5000);
  const [typeFilter, setTypeFilter]   = useState([]);
  const [locFilter, setLocFilter]     = useState([]);
  const [collapsed, setCollapsed]     = useState(false);

  const toggleArr = (arr,set,val) => set(p=>p.includes(val)?p.filter(x=>x!==val):[...p,val]);

  const filtered = ACCOMMODATIONS.filter(a=>
    a.price<=maxPrice &&
    (typeFilter.length===0||typeFilter.includes(a.type)) &&
    (locFilter.length===0||locFilter.includes(a.location))
  );

  const TYPES = { hotel:{icon:"🏨",th:"โรงแรม",en:"Hotel",zh:"酒店"}, resort:{icon:"🌴",th:"รีสอร์ท",en:"Resort",zh:"度假村"}, homestay:{icon:"🏡",th:"โฮมสเตย์",en:"Homestay",zh:"民宿"} };
  const LOCS  = { city:{icon:"🏙️",th:"ในเมือง",en:"City Center",zh:"市中心"}, beach:{icon:"🏖️",th:"ริมทะเล",en:"Beachfront",zh:"海滨"}, mountain:{icon:"🏔️",th:"ใกล้อุทยาน",en:"Near Park",zh:"近公园"} };

  return (
    <div className="accom-page">
      <div className="accom-inner">
        <div className="accom-hero">
          <h2>🏨 {L$(lang,"ค้นหาที่พักในเพชรบุรี","Find Stays in Phetchaburi","碧武里住宿搜索")}</h2>
          <p>{L$(lang,"กรองตามงบ ประเภท และทำเล — ทุกที่พักอยู่ในจังหวัดเพชรบุรี","Filter by budget, type & location — all properties in Phetchaburi","按预算、类型和位置筛选")}</p>
        </div>
        <div className="accom-layout">
          <div className="accom-filters">
            <div className="filter-collapse-header" onClick={()=>setCollapsed(p=>!p)}>
              <span>🔍 {L$(lang,"ตัวกรอง","Filters","筛选")}</span>
              <span style={{fontSize:"0.75rem"}}>{collapsed?L$(lang,"▼ แสดง","▼ Show","▼ 展开"):L$(lang,"▲ ซ่อน","▲ Hide","▲ 收起")}</span>
            </div>
            <div className={`filter-body${collapsed?" collapsed":""}`}>
            <div className="filter-section">
              <div className="filter-title">💰 {L$(lang,"งบสูงสุด/คืน","Max/night","最高/晚")}</div>
              <input type="range" min={400} max={5000} step={100} value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} className="price-slider"/>
              <div className="price-range"><span>฿400</span><span className="price-current">฿{maxPrice.toLocaleString()}</span><span>฿5,000</span></div>
            </div>
            <div className="filter-section">
              <div className="filter-title">🏷️ {L$(lang,"ประเภท","Type","类型")}</div>
              {Object.entries(TYPES).map(([k,v])=>(
                <button key={k} className={`filter-chip ${typeFilter.includes(k)?"active":""}`} onClick={()=>toggleArr(typeFilter,setTypeFilter,k)}>
                  {v.icon} {L$(lang,v.th,v.en,v.zh)}
                </button>
              ))}
            </div>
            <div className="filter-section">
              <div className="filter-title">📍 {L$(lang,"ทำเล","Location","位置")}</div>
              {Object.entries(LOCS).map(([k,v])=>(
                <button key={k} className={`filter-chip ${locFilter.includes(k)?"active":""}`} onClick={()=>toggleArr(locFilter,setLocFilter,k)}>
                  {v.icon} {L$(lang,v.th,v.en,v.zh)}
                </button>
              ))}
            </div>
            <button className="clear-filter-btn" onClick={()=>{setTypeFilter([]);setLocFilter([]);setMaxPrice(5000);}}>
              🔄 {L$(lang,"รีเซ็ต","Reset","重置")}
            </button>
            </div>
          </div>
          <div className="accom-results">
            <div className="results-count">{L$(lang,`พบ ${filtered.length} ที่พัก`,`${filtered.length} properties found`,`找到 ${filtered.length} 家`)}</div>
            {filtered.length===0
              ? <div className="no-results">😔 {L$(lang,"ไม่พบที่พัก ลองปรับตัวกรอง","No results, try adjusting filters","未找到结果")}</div>
              : filtered.map(a=>(
                  <div key={a.id} className="accom-card">
                    <div className="accom-card-img-wrap">
                      {a.image
                        ? <img src={a.image} alt={a.name} className="accom-card-img" onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}} />
                        : null}
                      <div className="accom-card-img-placeholder" style={{display:a.image?"none":"flex"}}>
                        <div className="accom-placeholder-inner">
                          <span className="accom-placeholder-icon">{TYPES[a.type]?.icon||"🏨"}</span>
                          <span className="accom-placeholder-name">{a.name}</span>
                          <a href={a.mapsUrl} target="_blank" rel="noreferrer" className="accom-placeholder-map">📸 {L$(lang,"ดูรูปใน Maps","Photos on Maps","在地图上查看照片")}</a>
                        </div>
                      </div>
                      <span className="accom-type-badge">{TYPES[a.type]?.icon} {L$(lang,TYPES[a.type]?.th,TYPES[a.type]?.en,TYPES[a.type]?.zh)}</span>
                      <span className="accom-loc-badge">{LOCS[a.location]?.icon} {L$(lang,LOCS[a.location]?.th,LOCS[a.location]?.en,LOCS[a.location]?.zh)}</span>
                    </div>
                    <div className="accom-card-body">
                      <div className="accom-card-header">
                        <h4 className="accom-name">{lang==="zh"?a.nameZh:lang==="en"?a.nameEn:a.name}</h4>
                        <div className="accom-rating">⭐ {a.rating}</div>
                      </div>
                      <p className="accom-desc">{lang==="zh"?a.descZh:lang==="en"?a.descEn:a.desc}</p>
                      <div className="accom-price">฿{a.price.toLocaleString()}<span>{L$(lang,"/คืน","/night","/晚")}</span></div>
                      <div className="accom-btns">
                        <a href={a.mapsUrl||`https://maps.google.com/maps?q=${encodeURIComponent(a.name)}`} target="_blank" rel="noreferrer" className="accom-btn map-view-btn">🗺️ {L$(lang,"ดูใน Google Maps","View on Google Maps","在谷歌地图查看")}</a>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ITINERARY PLANNER
// ══════════════════════════════════════════════
function ItineraryPlanner({ lang }) {
  const L = LANGS[lang];
  const [days, setDays]           = useState(1);
  const [interests, setInterests] = useState([]);
  const [travelWith, setTravelWith] = useState(L.travelOptions[0]);
  const [extraNote, setExtraNote] = useState("");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const toggleInterest = item => setInterests(p=>p.includes(item)?p.filter(i=>i!==item):[...p,item]);

  const generate = async () => {
    if (!interests.length) return;
    setLoading(true); setResult(null);
    try {
      const res  = await fetch(`${API}/api/itinerary`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({days,interests,travelWith,extraNote,lang})});
      const data = await res.json();
      if (res.status===429||data.errorType==="quota") { setResult("QUOTA_ERROR"); return; }
      setResult(data.itinerary||data.error);
    } catch { setResult("❌ เกิดข้อผิดพลาด"); }
    finally { setLoading(false); }
  };

  const {html:rHtml,cards:rCards} = result&&result!=="QUOTA_ERROR"?parseContent(result):{html:"",cards:[]};

  return (
    <div className="planner-page"><div className="planner-inner">
      <div className="planner-hero"><h2>{L.plannerTitle}</h2><p>{L.plannerSubtitle}</p></div>
      <div className="planner-card">
        <div className="form-row">
          <div className="form-group">
            <label>{L.days}</label>
            <div className="day-selector">
              {[1,2,3,4,5].map(d=><button key={d} className={`day-btn ${days===d?"active":""}`} onClick={()=>setDays(d)}>{d}{lang==="th"?"วัน":lang==="zh"?"天":"d"}</button>)}
            </div>
          </div>
          <div className="form-group">
            <label>{L.travelWith}</label>
            <div className="travel-selector">
              {L.travelOptions.map(t=><button key={t} className={`travel-btn ${travelWith===t?"active":""}`} onClick={()=>setTravelWith(t)}>{t}</button>)}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>{L.interests}</label>
          <div className="interest-grid">
            {L.interestOptions.map(item=><button key={item} className={`interest-chip ${interests.includes(item)?"selected":""}`} onClick={()=>toggleInterest(item)}>{item}</button>)}
          </div>
        </div>
        <div className="form-group">
          <label>📝 {L$(lang,"หมายเหตุเพิ่มเติม","Extra notes","备注")}</label>
          <input className="extra-input" placeholder={L$(lang,"เช่น มีเด็กเล็ก...","e.g. travelling with kids...","如：有小孩...")} value={extraNote} onChange={e=>setExtraNote(e.target.value)}/>
        </div>
        <button className={`generate-btn ${loading?"loading":""} ${!interests.length?"disabled":""}`} onClick={generate} disabled={loading||!interests.length}>
          {loading?L.generating:L.generateBtn}
        </button>
        {!interests.length&&<p className="hint-text">⬆️ {L$(lang,"เลือกความสนใจอย่างน้อย 1 อย่าง","Select at least one interest","请至少选择一个兴趣")}</p>}
      </div>
      {loading&&<div className="itinerary-loading"><div className="loading-dots"><span/><span/><span/></div><p>{L$(lang,"AI กำลังวางแผน...","Planning your trip...","AI正在规划...")}</p></div>}
      {result==="QUOTA_ERROR"&&<div className="quota-notice"><div className="quota-icon">⚠️</div><div className="quota-title">{L$(lang,"AI เกินโควต้า","Quota Exceeded","超出配额")}</div><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="quota-link">🔑 Create New API Key</a></div>}
      {result&&result!=="QUOTA_ERROR"&&!loading&&(
        <div className="itinerary-result">
          <div className="result-header">
            <span>🗺️ {L$(lang,"แผนทริปของคุณ","Your Itinerary","您的行程")}</span>
            <button className="copy-btn" onClick={()=>navigator.clipboard.writeText(result)}>📋 {L$(lang,"คัดลอก","Copy","复制")}</button>
          </div>
          <div className="result-content" dangerouslySetInnerHTML={{__html:rHtml}}/>
          {rCards.length>0&&<div className="result-cards"><div className="result-cards-label">🏨 {L$(lang,"ที่พักแนะนำ","Hotels","推荐住宿")}</div><div className="place-cards-row">{rCards.map((c,i)=><PlaceCard key={i} placeKey={c.key} lang={lang}/>)}</div></div>}
        </div>
      )}
    </div></div>
  );
}


// ══════════════════════════════════════════════
// FEATURE: BUDGET CALCULATOR
// ══════════════════════════════════════════════
const THB_TO_CNY = 0.205;   // 1 THB ≈ 0.205 CNY
const THB_TO_USD = 0.027;   // 1 THB ≈ 0.027 USD

const BUDGET_PRESETS_DATA = [
  { th:"💚 ประหยัด", en:"💚 Budget",  zh:"💚 经济",
    desc_th:"< 3,000 ฿",desc_en:"< 80 USD / 600 CNY",desc_zh:"< 600 ¥",
    v:{ nights:2, accomPerNight:550,  accomType:"homestay", food:280, foodDays:2,
        transport:"bus",  transportCost:300, activities:100, souvenirs:200 } },
  { th:"💛 มาตรฐาน",en:"💛 Standard",zh:"💛 标准",
    desc_th:"3,000–5,000 ฿",desc_en:"80–140 USD / 600–1,000 CNY",desc_zh:"600–1,000 ¥",
    v:{ nights:2, accomPerNight:1200, accomType:"hotel",    food:500, foodDays:2,
        transport:"rental", transportCost:1000, activities:300, souvenirs:500 } },
  { th:"💜 พรีเมียม",en:"💜 Premium",zh:"💜 高端",
    desc_th:"5,000+ ฿",desc_en:"> 140 USD / 1,000 CNY",desc_zh:"> 1,000 ¥",
    v:{ nights:3, accomPerNight:3000, accomType:"resort",   food:900, foodDays:3,
        transport:"rental", transportCost:1500, activities:700, souvenirs:1000 } },
];

const ACCOM_OPTS = [
  { v:"homestay", th:"🏡 โฮมสเตย์",  en:"🏡 Homestay", zh:"🏡 民宿",  price:550  },
  { v:"hotel",    th:"🏨 โรงแรม",    en:"🏨 Hotel",    zh:"🏨 酒店",  price:1200 },
  { v:"resort",   th:"🌊 รีสอร์ท",   en:"🌊 Resort",   zh:"🌊 度假村",price:3000 },
];
const TRANSPORT_OPTS = [
  { v:"bus",    th:"🚌 รถสาธารณะ", en:"🚌 Bus",        zh:"🚌 大巴",  price:300  },
  { v:"rental", th:"🚗 รถเช่า",    en:"🚗 Car Rental", zh:"🚗 租车",  price:1000 },
  { v:"taxi",   th:"🚕 แท็กซี่",   en:"🚕 Taxi/Grab",  zh:"🚕 出租车",price:600  },
];

const ACT_HINT = {
  th:"เขาวัง 150฿ · แก่งกระจาน 200฿ · ถ้ำเขาหลวง ฟรี · ตลาดไนท์ฟรี",
  en:"Khao Wang 150฿ · Kaeng Krachan 200฿ · Khao Luang Cave Free",
  zh:"考旺宫150฿ · 凯恩格拉占200฿ · 考銮洞免费 · 夜市免费",
};
const SOU_HINT = {
  th:"ขนมหม้อแกง 30–50฿ · สบู่สมุนไพร · ผ้าทอ",
  en:"Khanom Mo Kaeng 30–50฿ · Herbal soap · Local weaves",
  zh:"椰奶蛋挞30–50฿ · 草药皂 · 手工织物",
};

const CATS = [
  { k:"accom",     icon:"🏨", color:"#7C3AED", th:"ที่พัก",    en:"Accommodation",zh:"住宿" },
  { k:"food",      icon:"🍽️", color:"#BE185D", th:"อาหาร",    en:"Food",         zh:"餐饮" },
  { k:"transport", icon:"🚗", color:"#9333EA", th:"เดินทาง",  en:"Transport",    zh:"交通" },
  { k:"activities",icon:"🎟️", color:"#C026D3", th:"ค่าเข้าชม",en:"Activities",   zh:"门票" },
  { k:"souvenirs", icon:"🛍️", color:"#DB2777", th:"ของที่ระลึก",en:"Souvenirs",  zh:"纪念品"},
];

function BudgetCalculator({ lang }) {
  const [currency,   setCurrency]   = useState("THB");
  const [persons,    setPersons]    = useState(2);
  const [nights,     setNights]     = useState(2);
  const [accomType,  setAccomType]  = useState("hotel");
  const [accomPrice, setAccomPrice] = useState(1200);
  const [food,       setFood]       = useState(500);
  const [foodDays,   setFoodDays]   = useState(2);
  const [transport,  setTransport]  = useState("rental");
  const [transPrice, setTransPrice] = useState(1000);
  const [activities, setActivities] = useState(300);
  const [souvenirs,  setSouvenirs]  = useState(500);
  const [showResult, setShowResult] = useState(false);
  const [showReset,  setShowReset]  = useState(false);

  // Currency formatter
  const conv = (thb) => {
    if (currency === "CNY") return { sym:"¥", val: Math.round(thb * THB_TO_CNY) };
    if (currency === "USD") return { sym:"$", val: (thb * THB_TO_USD).toFixed(1) };
    return { sym:"฿", val: Math.round(thb) };
  };
  const fmt = (thb) => { const c = conv(thb); return `${c.sym}${Number(c.val).toLocaleString()}`; };

  const applyPreset = (p) => {
    const v = p.v;
    setNights(v.nights); setAccomType(v.accomType); setAccomPrice(v.accomPerNight);
    setFood(v.food); setFoodDays(v.foodDays); setTransport(v.transport);
    setTransPrice(v.transportCost); setActivities(v.activities); setSouvenirs(v.souvenirs);
    setShowResult(false);
  };

  const tAccom     = accomPrice * nights;
  const tFood      = food * foodDays * persons;
  const tTransport = transPrice;
  const tActivities= activities * persons;
  const tSouvenirs = souvenirs * persons;
  const grand      = tAccom + tFood + tTransport + tActivities + tSouvenirs;
  const perHead    = persons > 0 ? grand / persons : grand;

  const cats = CATS.map(c => ({
    ...c,
    thb: c.k==="accom"?tAccom:c.k==="food"?tFood:c.k==="transport"?tTransport:c.k==="activities"?tActivities:tSouvenirs,
    pct: grand > 0 ? Math.round((c.k==="accom"?tAccom:c.k==="food"?tFood:c.k==="transport"?tTransport:c.k==="activities"?tActivities:tSouvenirs)/grand*100) : 0,
  }));

  const doReset = () => {
    setPersons(2); setNights(2); setAccomType("hotel"); setAccomPrice(1200);
    setFood(500); setFoodDays(2); setTransport("rental"); setTransPrice(1000);
    setActivities(300); setSouvenirs(500); setShowResult(false); setShowReset(false);
  };

  const L3 = (th, en, zh) => lang==="zh"?zh:lang==="en"?en:th;
  const perHeadCNY = perHead * THB_TO_CNY;
  const budgetLevel = perHeadCNY < 600 ? L3("💚 ประหยัด","💚 Economy","💚 经济型")
    : perHeadCNY <= 1000 ? L3("💛 มาตรฐาน","💛 Standard","💛 标准型") : L3("💜 พรีเมียม","💜 Premium","💜 高端型");

  return (
    <div className="bc-wrap">
      <div className="bc-scroll">

        {/* ── HEADER ── */}
        <div className="bc-header">
          <div className="bc-header-left">
            <div className="bc-header-title">💰 {L3("คำนวณงบทริป","Trip Budget","旅行预算")}</div>
            <div className="bc-header-sub">{L3("เพชรบุรี & หัวหิน","Phetchaburi & Hua Hin","碧武里 & 华欣")}</div>
          </div>
          <div className="bc-header-right">
            <div className="bc-cur-toggle">
              {["THB","CNY","USD"].map(c=>(
                <button key={c} className={`bc-cur-btn${currency===c?" active":""}`} onClick={()=>setCurrency(c)}>
                  {c==="THB"?"฿":c==="CNY"?"¥":"$"} {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CARD 1: Preset + Persons ── */}
        <div className="bc-card">
          <div className="bc-card-row">
            <div className="bc-col">
              <div className="bc-label">{L3("⚡ เลือกงบ","⚡ Quick Select","⚡ 快速选择")}</div>
              <div className="bc-preset-row">
                {BUDGET_PRESETS_DATA.map((p,i)=>(
                  <button key={i} className="bc-preset-pill" onClick={()=>applyPreset(p)} title={lang==="zh"?p.desc_zh:lang==="en"?p.desc_en:p.desc_th}>
                    {lang==="zh"?p.zh:lang==="en"?p.en:p.th}
                    <span className="bc-preset-sub">{lang==="zh"?p.desc_zh:lang==="en"?p.desc_en:p.desc_th}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bc-col-sm">
              <div className="bc-label">👥 {L3("ผู้เดินทาง","Travelers","人数")}</div>
              <div className="bc-stepper">
                <button onClick={()=>setPersons(p=>Math.max(1,p-1))}>−</button>
                <span>{persons}</span>
                <button onClick={()=>setPersons(p=>Math.min(20,p+1))}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="bc-grid">

          {/* Accommodation */}
          <div className="bc-card">
            <div className="bc-card-title">🏨 {L3("ที่พัก","Accommodation","住宿")}</div>
            <div className="bc-chips">
              {ACCOM_OPTS.map(a=>(
                <button key={a.v} className={`bc-chip${accomType===a.v?" active":""}`}
                  onClick={()=>{setAccomType(a.v);setAccomPrice(a.price);}}>
                  {lang==="zh"?a.zh:lang==="en"?a.en:a.th}
                </button>
              ))}
            </div>
            <div className="bc-row2">
              <div className="bc-field">
                <label>🌙 {L3("คืน","Nights","晚")}</label>
                <div className="bc-stepper sm">
                  <button onClick={()=>setNights(n=>Math.max(1,n-1))}>−</button>
                  <span>{nights}</span>
                  <button onClick={()=>setNights(n=>Math.min(30,n+1))}>+</button>
                </div>
              </div>
              <div className="bc-field">
                <label>฿ {L3("/คืน","/night","/晚")}</label>
                <input className="bc-num-input" type="number" min="0" value={accomPrice}
                  onChange={e=>setAccomPrice(+e.target.value||0)}/>
              </div>
            </div>
            <div className="bc-preview">{nights}×฿{accomPrice.toLocaleString()} = <b>{fmt(tAccom)}</b></div>
          </div>

          {/* Food */}
          <div className="bc-card bc-food">
            <div className="bc-card-title">🍽️ {L3("ค่าอาหาร","Food","餐饮")} <span className="bc-badge">{L3("สำคัญ","Key","重点")}</span></div>
            <div className="bc-sub-hint">{ACT_HINT[lang]||ACT_HINT.th}</div>
            <div className="bc-row2">
              <div className="bc-field">
                <label>฿ {L3("/วัน/คน","/day/pax","/天/人")}</label>
                <input className="bc-num-input" type="number" min="0" value={food}
                  onChange={e=>setFood(+e.target.value||0)}/>
              </div>
              <div className="bc-field">
                <label>📅 {L3("วัน","Days","天")}</label>
                <div className="bc-stepper sm">
                  <button onClick={()=>setFoodDays(d=>Math.max(1,d-1))}>−</button>
                  <span>{foodDays}</span>
                  <button onClick={()=>setFoodDays(d=>Math.min(30,d+1))}>+</button>
                </div>
              </div>
            </div>
            <div className="bc-preview">{foodDays}d × ฿{food} × {persons}pax = <b>{fmt(tFood)}</b></div>
          </div>

          {/* Transport */}
          <div className="bc-card">
            <div className="bc-card-title">🚗 {L3("ค่าเดินทาง","Transport","交通")}</div>
            <div className="bc-sub-hint">{L3("กทม.→เพชรบุรี ~2ชม · เพชรบุรี→หัวหิน ~1ชม","BKK→Phetchaburi ~2h · Phetchaburi→Hua Hin ~1h","曼谷→碧武里~2h · 碧武里→华欣~1h")}</div>
            <div className="bc-chips">
              {TRANSPORT_OPTS.map(tr=>(
                <button key={tr.v} className={`bc-chip${transport===tr.v?" active":""}`}
                  onClick={()=>{setTransport(tr.v);setTransPrice(tr.price);}}>
                  {lang==="zh"?tr.zh:lang==="en"?tr.en:tr.th}
                </button>
              ))}
            </div>
            <div className="bc-field">
              <label>฿ {L3("รวมทริป","Total trip","全程")}</label>
              <input className="bc-num-input" type="number" min="0" value={transPrice}
                onChange={e=>setTransPrice(+e.target.value||0)}/>
            </div>
          </div>

          {/* Activities + Souvenirs */}
          <div className="bc-card">
            <div className="bc-card-title">🎟️ {L3("เข้าชม & ของที่ระลึก","Activities & Souvenirs","门票 & 纪念品")}</div>
            <div className="bc-row2">
              <div className="bc-field">
                <label>🎟️ ฿{L3("/คน","/pax","/人")}</label>
                <div className="bc-sub-hint" style={{marginBottom:"4px"}}>{ACT_HINT[lang]||ACT_HINT.th}</div>
                <input className="bc-num-input" type="number" min="0" value={activities}
                  onChange={e=>setActivities(+e.target.value||0)}/>
              </div>
              <div className="bc-field">
                <label>🛍️ ฿{L3("/คน","/pax","/人")}</label>
                <div className="bc-sub-hint" style={{marginBottom:"4px"}}>{SOU_HINT[lang]||SOU_HINT.th}</div>
                <input className="bc-num-input" type="number" min="0" value={souvenirs}
                  onChange={e=>setSouvenirs(+e.target.value||0)}/>
              </div>
            </div>
          </div>
        </div>

        {/* ── ACTIONS ── */}
        <div className="bc-actions">
          <button className="bc-calc-btn" onClick={()=>setShowResult(true)}>
            ✨ {L3("คำนวณทันที","Calculate Now","立即计算")}
          </button>
          <button className="bc-reset-btn" onClick={()=>setShowReset(true)}>
            🗑️ {L3("ล้าง","Reset","重置")}
          </button>
        </div>

        {/* ── RESULT ── */}
        {showResult&&(
          <div className="bc-result">
            {/* Totals */}
            <div className="bc-result-top">
              <div className="bc-result-main">
                <div className="bc-result-label">{L3("รวมทั้งหมด","Grand Total","总计")}</div>
                <div className="bc-result-big">{fmt(grand)}</div>
              </div>
              <div className="bc-result-sub-col">
                <div className="bc-result-sub-row">
                  <span>{L3("เฉลี่ย/คน","Per Person","人均")}</span>
                  <span className="bc-result-sub-val">{fmt(perHead)}</span>
                </div>
                {currency==="THB"&&(
                  <>
                  <div className="bc-result-sub-row dim">
                    <span>≈ CNY</span><span>¥{Math.round(grand*THB_TO_CNY).toLocaleString()}</span>
                  </div>
                  <div className="bc-result-sub-row dim">
                    <span>≈ USD</span><span>${(grand*THB_TO_USD).toFixed(0)}</span>
                  </div>
                  </>
                )}
                <div className="bc-result-badge">{budgetLevel}</div>
              </div>
            </div>

            {/* Bar chart */}
            <div className="bc-bars">
              {cats.filter(c=>c.thb>0).map(c=>(
                <div key={c.k} className="bc-bar-row">
                  <div className="bc-bar-meta">
                    <span>{c.icon} {lang==="zh"?c.zh:lang==="en"?c.en:c.th}</span>
                    <span style={{color:c.color,fontWeight:700}}>{fmt(c.thb)} <span style={{color:"#9CA3AF",fontWeight:400}}>({c.pct}%)</span></span>
                  </div>
                  <div className="bc-bar-track">
                    <div className="bc-bar-fill" style={{width:`${c.pct}%`,background:c.color}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Pie + legend */}
            <div className="bc-pie-row">
              <svg viewBox="0 0 100 100" className="bc-pie">
                {(()=>{
                  let off=0;
                  return cats.filter(c=>c.thb>0).map(c=>{
                    const d=c.pct, g=100-d, r=off*3.6;
                    off+=c.pct;
                    return <circle key={c.k} r="16" cx="50" cy="50" fill="none"
                      stroke={c.color} strokeWidth="32"
                      strokeDasharray={`${d} ${g}`}
                      strokeDashoffset={25-off+c.pct}
                      transform={`rotate(${r-90} 50 50)`}/>;
                  });
                })()}
              </svg>
              <div className="bc-pie-legend">
                {cats.filter(c=>c.thb>0).map(c=>(
                  <div key={c.k} className="bc-legend-item">
                    <span className="bc-legend-dot" style={{background:c.color}}/>
                    <span>{c.icon} {lang==="zh"?c.zh:lang==="en"?c.en:c.th} {c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>


          </div>
        )}

        <div style={{height:"72px"}}/>
      </div>

      {/* ── Reset Modal ── */}
      {showReset&&(
        <div className="del-modal-overlay" onClick={()=>setShowReset(false)}>
          <div className="del-modal" onClick={e=>e.stopPropagation()}>
            <div className="del-modal-icon">🔄</div>
            <h3 className="del-modal-title">{lang==="zh"?"确认重置":lang==="en"?"Confirm Reset":"ล้างข้อมูลทั้งหมด?"}</h3>
            <p className="del-modal-desc">{lang==="zh"?"数据将被清空，无法恢复":lang==="en"?"All inputs will be cleared.":"ข้อมูลจะถูกล้างทั้งหมด ไม่สามารถย้อนกลับได้"}</p>
            <div className="del-modal-btns">
              <button className="del-btn-cancel" onClick={()=>setShowReset(false)}>{lang==="zh"?"取消":lang==="en"?"Cancel":"ยกเลิก"}</button>
              <button className="del-btn-confirm" onClick={doReset}>{lang==="zh"?"🗑️ 重置":lang==="en"?"🗑️ Reset":"🗑️ ล้างข้อมูล"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// MANUAL CONTENT COMPONENTS
// ══════════════════════════════════════════════
function ManualSection({icon, title, children}) {
  return (
    <div className="ms-section">
      <h3 className="ms-heading"><span className="ms-icon">{icon}</span>{title}</h3>
      <div className="ms-body">{children}</div>
    </div>
  );
}
function ManualTable({rows}) {
  return (
    <table className="ms-table">
      <tbody>{rows.map((r,i)=>(
        <tr key={i}><td className="ms-td-label">{r[0]}</td><td className="ms-td-val">{r[1]}</td></tr>
      ))}</tbody>
    </table>
  );
}

function ManualTH() {
  return (
    <div className="manual-content">
      <div className="ms-cover">
        <img src="/Phetbot_No_bg.png" alt="น้องเพชร" className="ms-cover-logo"/>
        <h1 className="ms-cover-title">คู่มือการใช้งานระบบ</h1>
        <h2 className="ms-cover-subtitle">น้องเพชร — ไกด์ท่องเที่ยว AI เพชรบุรี–หัวหิน</h2>
        <p className="ms-cover-desc">เอกสารนี้อธิบายการใช้งานระบบแชทบอท AI ผ่าน Gemini API สำหรับนักท่องเที่ยว</p>
      </div>
      <ManualSection icon="🎯" title="วัตถุประสงค์">
        <p>น้องเพชรเป็นระบบแชทบอท AI ที่ออกแบบมาเพื่อช่วยนักท่องเที่ยวชาวจีนวางแผนการท่องเที่ยวในจังหวัดเพชรบุรีและหัวหิน รองรับภาษาไทย อังกฤษ และจีนกลาง (ภาษาเขียนแบบย่อ)</p>
      </ManualSection>
      <ManualSection icon="✨" title="ฟีเจอร์หลัก">
        <ManualTable rows={[
          ["💬 แชทถามตอบ","ถามข้อมูลท่องเที่ยว สถานที่ อาหาร การเดินทาง ตลอด 24 ชม."],
          ["📚 วางแผนทริป","สร้างตารางเที่ยวรายวัน ระบุความสนใจและจำนวนวัน"],
          ["🎪 เทศกาล","ปฏิทินเทศกาลประจำปีของเพชรบุรีและพื้นที่ใกล้เคียง"],
          ["🏨 ที่พัก","ค้นหาและเปรียบเทียบโรงแรม รีสอร์ท โฮมสเตย์"],
          ["💰 งบประมาณ","คำนวณค่าใช้จ่ายการเดินทาง ที่พัก อาหาร และค่าเข้าชม"],
          ["🌐 3 ภาษา","เปลี่ยนภาษาได้ทันทีจากเมนูด้านซ้าย: ไทย / EN / 中文"],
        ]}/>
      </ManualSection>
      <ManualSection icon="📋" title="วิธีใช้งาน">
        <ol className="ms-steps">
          <li><strong>เลือกภาษา</strong> — คลิกปุ่มเลือกภาษาในแถบเมนูด้านซ้าย</li>
          <li><strong>พิมพ์คำถาม</strong> — พิมพ์ในช่องด้านล่าง หรือเลือกจากเมนูด่วน</li>
          <li><strong>ดูการ์ดสถานที่</strong> — คลิก 🗺️ เพื่อดูแผนที่ หรือ 📍 เพื่อนำทาง</li>
          <li><strong>วางแผนทริป</strong> — ไปที่แท็บ 📚 กรอกจำนวนวันและความสนใจ</li>
          <li><strong>บันทึกการสนทนา</strong> — ระบบบันทึกอัตโนมัติ กดดาว ⭐ เพื่อ pin ไว้</li>
        </ol>
      </ManualSection>
      <ManualSection icon="💡" title="คำแนะนำการใช้งาน">
        <div className="ms-tips">
          <div className="ms-tip-card safety"><div className="ms-tip-title">🔒 ความปลอดภัย</div><p>บันทึกเบอร์ฉุกเฉิน 1155 (ตำรวจท่องเที่ยว), 191, 1669 ไว้ในโทรศัพท์ก่อนเดินทาง พกสำเนาหนังสือเดินทาง เก็บของมีค่าในตู้เซฟโรงแรม</p></div>
          <div className="ms-tip-card culture"><div className="ms-tip-title">🙏 มารยาทวัด</div><p>แต่งกายสุภาพ ปิดไหล่ปิดเข่า ถอดรองเท้าก่อนเข้าอาคาร ห้ามชี้เท้าไปที่พระพุทธรูป รักษาความสงบ</p></div>
          <div className="ms-tip-card facility"><div className="ms-tip-title">🚻 ห้องน้ำ</div><p>แนะนำใช้ห้องน้ำที่ปั๊ม PTT หรือห้างสรรพสินค้า ชายหาดชะอำมีห้องน้ำสาธารณะทุก 500 ม. ชายหาดหัวหินมีห้องน้ำแบบชำระเงิน (5 บาท)</p></div>
        </div>
      </ManualSection>
      <div className="ms-footer">
        <p>© 2025 น้องเพชร — ระบบ AI ท่องเที่ยวเพชรบุรี–หัวหิน</p>
        <p className="ms-muted">ราคาและเวลาทำการอาจเปลี่ยนแปลงตามฤดูกาล กรุณาตรวจสอบก่อนเดินทาง</p>
      </div>
    </div>
  );
}

function ManualEN() {
  return (
    <div className="manual-content">
      <div className="ms-cover">
        <img src="/Phetbot_No_bg.png" alt="Nong Phet" className="ms-cover-logo"/>
        <h1 className="ms-cover-title">User Manual</h1>
        <h2 className="ms-cover-subtitle">Nong Phet — AI Tourism Guide for Phetchaburi & Hua Hin</h2>
        <p className="ms-cover-desc">This document explains how to use the AI chatbot system powered by Gemini API.</p>
      </div>
      <ManualSection icon="🎯" title="Purpose">
        <p>Nong Phet is an AI chatbot designed to help tourists plan trips to Phetchaburi province and Hua Hin. It supports Thai, English, and Simplified Chinese.</p>
      </ManualSection>
      <ManualSection icon="✨" title="Key Features">
        <ManualTable rows={[
          ["💬 Chat Q&A","Ask about attractions, food, transport anytime 24/7"],
          ["📚 Trip Planner","Generate day-by-day itineraries based on your interests"],
          ["🎪 Festivals","Annual festival calendar for Phetchaburi region"],
          ["🏨 Accommodation","Search and compare hotels, resorts, homestays"],
          ["💰 Budget Calc","Estimate costs for transport, hotels, food & entrance fees"],
          ["🌐 3 Languages","Switch instantly: Thai / English / Chinese from the sidebar"],
        ]}/>
      </ManualSection>
      <ManualSection icon="📋" title="How to Use">
        <ol className="ms-steps">
          <li><strong>Select Language</strong> — Click the language selector in the left sidebar</li>
          <li><strong>Type a Question</strong> — Type in the chat box or pick from the quick menu</li>
          <li><strong>View Place Cards</strong> — Click 🗺️ to view map or 📍 for navigation</li>
          <li><strong>Plan a Trip</strong> — Go to 📚 tab, enter days and interests</li>
          <li><strong>Save Chats</strong> — Chats are auto-saved; star ⭐ to pin important ones</li>
        </ol>
      </ManualSection>
      <ManualSection icon="💡" title="Tips & Advice">
        <div className="ms-tips">
          <div className="ms-tip-card safety"><div className="ms-tip-title">🔒 Safety</div><p>Save emergency numbers before traveling: Tourist Police 1155, Emergency 191, Ambulance 1669. Carry passport copies and store valuables in hotel safe.</p></div>
          <div className="ms-tip-card culture"><div className="ms-tip-title">🙏 Temple Etiquette</div><p>Dress modestly (cover shoulders and knees). Remove shoes before entering temple buildings. Do not point feet toward Buddha images. Stay quiet and respectful.</p></div>
          <div className="ms-tip-card facility"><div className="ms-tip-title">🚻 Restrooms</div><p>PTT gas stations and shopping malls have clean restrooms. Cha-am beach has public restrooms every 500m. Hua Hin beach has paid restrooms (5 THB).</p></div>
        </div>
      </ManualSection>
      <div className="ms-footer">
        <p>© 2025 Nong Phet — Phetchaburi & Hua Hin AI Tourism System</p>
        <p className="ms-muted">Prices and opening hours may vary by season. Please verify before traveling.</p>
      </div>
    </div>
  );
}

function ManualZH() {
  return (
    <div className="manual-content">
      <div className="ms-cover">
        <img src="/Phetbot_No_bg.png" alt="小碧" className="ms-cover-logo"/>
        <h1 className="ms-cover-title">使用手册</h1>
        <h2 className="ms-cover-subtitle">小碧 — 碧武里–华欣AI旅游助手</h2>
        <p className="ms-cover-desc">本文档介绍如何使用基于 Gemini API 的AI旅游聊天机器人系统。</p>
      </div>
      <ManualSection icon="🎯" title="系统目标">
        <p>小碧是专为中国游客设计的AI聊天助手，帮助规划碧武里府和华欣的旅行。支持泰语、英语和简体中文。</p>
      </ManualSection>
      <ManualSection icon="✨" title="主要功能">
        <ManualTable rows={[
          ["💬 智能问答","随时询问景点、美食、交通等旅游信息"],
          ["📚 行程规划","根据兴趣生成每日详细行程安排"],
          ["🎪 节日日历","碧武里地区全年节日活动日历"],
          ["🏨 住宿搜索","搜索比较酒店、度假村、民宿"],
          ["💰 预算计算","估算交通、住宿、餐饮和门票费用"],
          ["🌐 三语支持","从侧边栏即时切换：泰语 / English / 中文"],
        ]}/>
      </ManualSection>
      <ManualSection icon="📋" title="使用步骤">
        <ol className="ms-steps">
          <li><strong>选择语言</strong> — 点击左侧边栏的语言选择器</li>
          <li><strong>输入问题</strong> — 在聊天框中输入，或从快捷菜单中选择</li>
          <li><strong>查看地点卡片</strong> — 点击 🗺️ 查看地图，点击 📍 获取导航</li>
          <li><strong>规划行程</strong> — 前往 📚 标签，输入天数和兴趣爱好</li>
          <li><strong>保存对话</strong> — 对话自动保存，点击 ⭐ 收藏重要内容</li>
        </ol>
      </ManualSection>
      <ManualSection icon="💡" title="使用建议">
        <div className="ms-tips">
          <div className="ms-tip-card safety"><div className="ms-tip-title">🔒 安全提示</div><p>出发前保存紧急号码：旅游警察1155、紧急情况191、救护车1669。携带护照复印件，贵重物品存放酒店保险箱。</p></div>
          <div className="ms-tip-card culture"><div className="ms-tip-title">🙏 寺庙礼仪</div><p>进入寺庙需穿着得体（遮肩盖膝），脱鞋后方可入内，禁止用脚指向佛像，保持安静肃穆。</p></div>
          <div className="ms-tip-card facility"><div className="ms-tip-title">🚻 卫生间</div><p>建议使用PTT加油站或购物中心的卫生间。七岩海滩每500米有公共卫生间。华欣海滩有收费卫生间（5泰铢）。</p></div>
        </div>
      </ManualSection>
      <div className="ms-footer">
        <p>© 2025 小碧（น้องเพชร）— 碧武里–华欣AI旅游系统</p>
        <p className="ms-muted">价格和营业时间可能随季节变化，出发前请再次确认。</p>
      </div>
    </div>
  );
}

// MAIN APP
// ══════════════════════════════════════════════
export default function App() {
  const [lang, setLang]               = useState("th");
  const [darkMode, setDarkMode]       = useState(isNightTime());
  const [autoNight, setAutoNight]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab]     = useState("chat");
  const [showQuickMenu, setShowQuickMenu] = useState(()=>localStorage.getItem('qmHidden')!=='1');
  const [showAdmin, setShowAdmin]         = useState(false);
  const [deleteModal, setDeleteModal]     = useState(null);  // {id, title} or "all"
  const [showEmergency, setShowEmergency]   = useState(false);
  const [toast, setToast]                 = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [obStep, setObStep] = useState(0);
  const [showManual, setShowManual]         = useState(false);
  const [manualLang, setManualLang]         = useState("th");
  const [sessions, setSessions]           = useState(()=>loadSessions());
  const L = LANGS[lang];

  const [messages, setMessages] = useState([{role:"bot",text:LANGS["th"].welcome}]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sessionId]             = useState(()=>`session_${Date.now()}`);
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);
  const [topbarShrink, setTopbarShrink] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(()=>{
    const el = messagesRef.current;
    if (!el) return;
    const onScroll = ()=>{
      const y = el.scrollTop;
      setTopbarShrink(y > 60 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return ()=>el.removeEventListener('scroll', onScroll);
  }, []);

  // ── Mobile Keyboard / Viewport fix — iOS Safari + Android Chrome ──
  useEffect(()=>{
    const html = document.documentElement;

    const update = ()=>{
      const vv = window.visualViewport;
      const h  = vv ? vv.height : window.innerHeight;
      html.style.setProperty('--app-h', h + 'px');

      // Mark keyboard state: true if visible area < 75% of full screen height
      // Works on both iOS (visualViewport shrinks) and Android (innerHeight shrinks)
      const isKeyboard = h < window.screen.height * 0.75;
      if (isKeyboard) {
        html.setAttribute('data-kb', '');
      } else {
        html.removeAttribute('data-kb');
      }
    };

    update();
    const vv = window.visualViewport;
    vv?.addEventListener('resize', update, { passive: true });
    vv?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(update, 200));
    return () => {
      vv?.removeEventListener('resize', update);
      vv?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(()=>{ if(!autoNight)return; const i=setInterval(()=>setDarkMode(isNightTime()),60000); return ()=>clearInterval(i); },[autoNight]);
  useEffect(()=>{ document.documentElement.classList.toggle("dark",darkMode); },[darkMode]);
  useEffect(()=>{ setMessages([{role:"bot",text:LANGS[lang].welcome}]); },[lang]);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);

  const newChat = () => { setMessages([{role:"bot",text:LANGS[lang].welcome}]); setInput(""); setActiveTab("chat"); };

  const sendMessage = useCallback(async (text) => {
    const userText = text||input.trim();
    if (!userText||loading) return;
    setInput("");
    const newMessages = [...messages,{role:"user",text:userText}];
    setMessages(newMessages);
    setLoading(true);
    logQuery(userText);
    if (activeTab!=="chat") setActiveTab("chat");
    try {
      const res  = await fetch(`${API}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:userText,sessionId,lang})});
      const data = await res.json();
      if (res.status===429||data.errorType==="quota") { setMessages(p=>[...p,{role:"bot",text:LANGS[lang].quotaMsg,isQuota:true}]); return; }
      if (data.error) throw new Error(data.error);
      const finalMessages = [...newMessages,{role:"bot",text:data.reply}];
      setMessages(finalMessages);
      saveSession(sessionId,finalMessages);
      setSessions(loadSessions());
    } catch { setMessages(p=>[...p,{role:"bot",text:LANGS[lang].errorMsg}]); }
    finally { setLoading(false); }
  },[input,loading,sessionId,lang,activeTab,messages]);

  const handleKeyDown = e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();} };
  const isWelcome = messages.length<=1;

  const tabTitles = { chat:"💬 "+L.chatTab, planner:"📚 "+L.plannerTab, festival:"🎪 "+(lang==="th"?"เทศกาล":lang==="zh"?"节庆":"Festivals"), accom:"🏨 "+(lang==="th"?"ที่พัก":lang==="zh"?"住宿":"Stays"), budget:"💰 "+(lang==="th"?"คำนวณงบ":lang==="zh"?"预算计算":"Budget") };
  // Nav icons (sidebar only — NOT reused in topbar to avoid duplication)
  const NAV_ICONS = { chat:"💬", planner:"📚", festival:"🎪", accom:"🏨", budget:"💰" };

  return (
    <div className={`dashboard ${darkMode?"dark":""} ${sidebarOpen?"sidebar-open":"sidebar-closed"}`}>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <img src={PHETBOT_LOGO} alt="น้องเพชร" className="brand-logo-img"/>
            {sidebarOpen&&<span className="brand-name">น้องเพชร</span>}
          </div>
          <button className="sidebar-toggle" onClick={()=>setSidebarOpen(s=>!s)}>{sidebarOpen?"◀":"▶"}</button>
        </div>

        {sidebarOpen&&(<>
          <button className="new-chat-btn" onClick={newChat}>✏️ {L.newChat}</button>

          {/* Main nav */}
          <nav className="sidebar-nav">
            {[
              {id:"chat",    icon:"💬", th:"แชท",     en:"Chat",      zh:"聊天"},
              {id:"planner", icon:"📚", th:"จัดทริป",  en:"Plan Trip", zh:"行程规划"},
              {id:"festival",icon:"🎪", th:"เทศกาล",   en:"Festivals", zh:"节庆"},
              {id:"accom",   icon:"🏨", th:"ที่พัก",   en:"Stays",     zh:"住宿"},
              {id:"budget",  icon:"💰", th:"คำนวณงบ", en:"Budget",    zh:"预算"},
            ].map(t=>(
              <button key={t.id} className={`nav-item ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}>
                <span>{t.icon}</span><span className="nav-label">{L$(lang,t.th,t.en,t.zh)}</span>
              </button>
            ))}
          </nav>


          {/* Session history (Feature 6) */}
          {sessions.length>0&&(<>
            <div className="sidebar-section-label">
              {L$(lang,"ประวัติแชท","History","历史")}
            </div>
            <nav className="sidebar-nav history-nav">
              {sessions.slice(0,8).map(sess=>(
                <div key={sess.id} className="history-item">
                  <button className="history-load" onClick={()=>{setMessages(sess.messages);setActiveTab("chat");}}>
                    💬 {sess.title}
                  </button>
                  <button className={`history-star ${sess.starred?"starred":""}`}
                    onClick={()=>{toggleStar(sess.id);setSessions(loadSessions());}}>
                    {sess.starred?"⭐":"☆"}
                  </button>
                  <button className="history-del" title="ลบ"
                    onClick={()=>setDeleteModal({id:sess.id,title:sess.title})}>
                    ✕
                  </button>
                </div>
              ))}
            </nav>
          </>)}

          {/* Emergency Button */}
          <button className="sidebar-emg-btn" onClick={()=>setShowEmergency(true)}>
            🚨 {L$(lang,"เบอร์ฉุกเฉิน","Emergency","紧急求助")}
          </button>

          {/* Settings */}
          <div className="sidebar-bottom">
            <div className="sidebar-section-label">{L$(lang,"การตั้งค่า","Settings","设置")}</div>
            <div className="lang-selector-side">
              <div className="lang-select-wrap">
                <span className="lang-select-icon">{LANGS[lang].label.split(" ")[0]}</span>
                <select className="lang-select-native" value={lang} onChange={e=>setLang(e.target.value)}>
                  {Object.values(LANGS).map(l=>(
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="nav-item" onClick={()=>{setAutoNight(false);setDarkMode(d=>!d);}}>
              <span>{darkMode?"☀️":"🌙"}</span><span className="nav-label">{darkMode?"Light Mode":"Dark Mode"}</span>
            </button>
            <button className="nav-item sidebar-manual-btn" onClick={()=>{setManualLang(lang);setShowManual(true);}}>
              <span>📄</span><span className="nav-label">{L$(lang,"คู่มือการใช้งาน","User Manual","使用手册")}</span>
            </button>
            <button className="nav-item" onClick={()=>setShowAdmin(true)}>
              <span>📊</span><span className="nav-label">Admin</span>
            </button>
          </div>
        </>)}

      {/* Floating expand tab when sidebar is closed */}
      {!sidebarOpen&&(
        <div className="sidebar-float-tab">
          <button className="sft-expand" onClick={()=>setSidebarOpen(true)} title="เปิดเมนู">▶</button>
          <button className="sft-lang" onClick={()=>{
            const codes=Object.keys(LANGS);
            setLang(codes[(codes.indexOf(lang)+1)%codes.length]);
          }} title="เปลี่ยนภาษา">🌐</button>
        </div>
      )}
      </aside>

      {/* ── MAIN ── */}
      <main className="main-area">
        <header className={`topbar${topbarShrink?" topbar-shrink":""}`}>
          {/* PC left */}
          <div className="topbar-left">
            <span className="topbar-title">{NAV_ICONS[activeTab]||"💬"} {activeTab==="chat"?L.chatTab:activeTab==="planner"?L.plannerTab:activeTab==="festival"?(lang==="th"?"เทศกาล":lang==="zh"?"节庆":"Festivals"):(lang==="th"?"ที่พัก":lang==="zh"?"住宿":"Stays")}</span>
            {activeTab==="chat"&&autoNight&&darkMode&&<span className="night-pill">🌙 Auto Dark</span>}
          </div>
          {/* Mobile: hamburger left + title center + new-chat right */}
          <button className="mob-hamburger" onClick={()=>setMobileMenuOpen(true)} aria-label="Menu">
            <span/><span/><span/>
          </button>
          <span className="mob-title"><img src={PHETBOT_LOGO} alt="" className="mob-logo-img"/>น้องเพชร</span>
          <div className="topbar-right">
            {activeTab==="chat"&&(
              <button className="qm-toggle-btn" onClick={()=>setShowQuickMenu(s=>{ localStorage.setItem('qmHidden', s?'1':'0'); return !s; })}>
                {showQuickMenu?L.hideMenu:L.showMenu}
              </button>
            )}
            <button className="new-chat-btn-top" onClick={newChat}>✏️ <span className="btn-label-pc">{L.newChat}</span></button>
          </div>
        </header>

        {activeTab==="chat" ? (
          <div className="chat-layout">
            <div className="messages-area" ref={messagesRef}>
              {isWelcome&&(
                <div className="welcome-screen">
                  <div className="welcome-avatar"><img src={PHETBOT_LOGO} alt="น้องเพชร" className="welcome-logo-img"/></div>
                  <h1>{L$(lang,"สวัสดีค่ะ! ฉันคือน้องเพชร","Hello! I'm Nong Phet","您好！我是小碧")}</h1>
                  <p>{L$(lang,"ไกด์ท่องเที่ยว AI เพชรบุรี–หัวหิน","AI Tourism Guide for Phetchaburi","碧武里AI旅游向导")}</p>
                  <div className="welcome-chips">
                    {L.suggestions.map((q,i)=><button key={i} className="welcome-chip" onClick={()=>sendMessage(q)}>{q}</button>)}
                  </div>
                  <div className="welcome-nav-row">
                    {[
                      {id:"planner",icon:"📚",th:"จัดทริป",en:"Plan Trip",zh:"规划行程"},
                      {id:"festival",icon:"🎪",th:"เทศกาล",en:"Festivals",zh:"节庆"},
                      {id:"accom",icon:"🏨",th:"ที่พัก",en:"Stays",zh:"住宿"},
                    ].map(t=>(
                      <button key={t.id} className="welcome-nav-btn" onClick={()=>setActiveTab(t.id)}>
                        <span>{t.icon}</span>
                        <span>{L$(lang,t.th,t.en,t.zh)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!isWelcome&&messages.map((msg,i)=><Message key={i} msg={msg} lang={lang}/>)}
              {loading&&<TypingIndicator/>}
              <div ref={bottomRef}/>
            </div>
            <div className="input-section">
              {showQuickMenu&&(
                <div className="quick-menu-bar">
                  {L.quickMenu.map((item,i)=>(
                    <button key={i} className="qm-chip" onClick={()=>sendMessage(item.msg)}>{item.icon} {item.label}</button>
                  ))}
                  <button className="qm-close-btn" onClick={()=>{setShowQuickMenu(false);localStorage.setItem('qmHidden','1');}} title="ซ่อน">✕</button>
                </div>
              )}
              <div className="input-box">
                <button className="gps-btn" title={L$(lang,"แชร์ตำแหน่งของฉัน","Share my location","分享位置")}
                  onClick={()=>{
                    if (!navigator.geolocation) { alert(L$(lang,"Browser ไม่รองรับ GPS","GPS not supported","GPS不支持")); return; }
                    navigator.geolocation.getCurrentPosition(
                      pos => {
                        const {latitude:lat, longitude:lng} = pos.coords;
                        const msg = lang==="th"
                          ? `ฉันอยู่ที่พิกัด ${lat.toFixed(5)}, ${lng.toFixed(5)} แนะนำที่เที่ยวในเพชรบุรีที่อยู่ใกล้ฉันหน่อยได้ไหม?`
                          : lang==="zh"
                          ? `我在坐标 ${lat.toFixed(5)}, ${lng.toFixed(5)}，请推荐碧武里附近的景点`
                          : `I'm at ${lat.toFixed(5)}, ${lng.toFixed(5)} — what Phetchaburi attractions are near me?`;
                        sendMessage(msg);
                      },
                      (err) => {
                        const hint = lang==="th"
                          ? "ไม่สามารถเข้าถึง GPS ได้ค่ะ กรุณากด Allow ที่ browser แล้วลองใหม่"
                          : "Cannot access GPS. Please allow location access in your browser.";
                        alert(hint);
                      },
                      { timeout:10000, enableHighAccuracy:true }
                    );
                  }}>
                  📍
                </button>
                <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder={L.placeholder} rows={1} disabled={loading}/>
                <button className={`send-btn ${loading?"loading":""}`} onClick={()=>sendMessage()} disabled={loading||!input.trim()}>
                  {loading?"⏳":"➤"}
                </button>
              </div>
              <p className="input-hint">{L$(lang,"Enter ส่ง • Shift+Enter ขึ้นบรรทัดใหม่","Enter to send • Shift+Enter new line","Enter发送 • Shift+Enter换行")}</p>
            </div>
          </div>
        ) : activeTab==="planner" ? (
          <div className="planner-area"><ItineraryPlanner lang={lang}/></div>
        ) : activeTab==="festival" ? (
          <div className="planner-area"><FestivalCalendar lang={lang}/></div>
        ) : activeTab==="accom" ? (
          <div className="planner-area"><AccomFilter lang={lang}/></div>
        ) : activeTab==="budget" ? (
          <div className="planner-area" style={{overflow:"hidden"}}><BudgetCalculator lang={lang}/></div>
        ) : null}
      </main>

      {showAdmin&&<AdminDashboard onClose={()=>setShowAdmin(false)}/>}

      {/* ── MOBILE DRAWER (Claude-style slide-in) ── */}
      {mobileMenuOpen&&(
        <div className="mob-overlay" onClick={()=>setMobileMenuOpen(false)}>
          <aside className="mob-drawer" onClick={e=>e.stopPropagation()}>
            {/* Drawer header */}
            <div className="mob-drawer-header">
              <span className="mob-drawer-brand">น้องเพชร</span>
              <button className="mob-drawer-close" onClick={()=>setMobileMenuOpen(false)}>✕</button>
            </div>

            {/* New chat */}
            <button className="mob-new-chat" onClick={()=>{newChat();setMobileMenuOpen(false);}}>
              ✏️ {L.newChat}
            </button>

            {/* Nav items */}
            <div className="mob-drawer-section">{L$(lang,"เมนูหลัก","Navigation","导航")}</div>
            {[
              {id:"chat",    icon:"💬", th:"แชท",     en:"Chat",      zh:"聊天"},
              {id:"planner", icon:"📚", th:"จัดทริป",  en:"Plan Trip", zh:"行程规划"},
              {id:"festival",icon:"🎪", th:"เทศกาล",   en:"Festivals", zh:"节庆"},
              {id:"accom",   icon:"🏨", th:"ที่พัก",   en:"Stays",     zh:"住宿"},
              {id:"budget",  icon:"💰", th:"คำนวณงบ", en:"Budget",    zh:"预算"},
            ].map(t=>(
              <button key={t.id} className={`mob-drawer-item ${activeTab===t.id?"active":""}`}
                onClick={()=>{setActiveTab(t.id);setMobileMenuOpen(false);}}>
                <span className="mob-drawer-icon">{t.icon}</span>
                <span>{L$(lang,t.th,t.en,t.zh)}</span>
              </button>
            ))}


            {/* History */}
            {sessions.length>0&&(<>
              <div className="mob-drawer-section">{L$(lang,"ประวัติแชท","History","历史")}</div>
              {sessions.slice(0,5).map(sess=>(
                <div key={sess.id} className="mob-drawer-history">
                  <button className={`mob-hist-star${sess.starred?" starred":""}`}
                    onClick={()=>{toggleStar(sess.id);setSessions(loadSessions());}}>
                    {sess.starred?"⭐":"☆"}
                  </button>
                  <button className="mob-drawer-item mob-hist-load"
                    onClick={()=>{setMessages(sess.messages);setActiveTab("chat");setMobileMenuOpen(false);}}>
                    <span className="mob-hist-title">{sess.title}</span>
                  </button>
                  <button className="mob-hist-del"
                    onClick={()=>setDeleteModal({id:sess.id,title:sess.title})}>✕</button>
                </div>
              ))}
            </>)}

            {/* Emergency */}
            <button className="mob-emg-btn" onClick={()=>{setShowEmergency(true);setMobileMenuOpen(false);}}>
              🚨 {L$(lang,"เบอร์ฉุกเฉิน","Emergency Numbers","紧急求助")}
            </button>

            {/* Settings */}
            <div className="mob-drawer-section">{L$(lang,"ตั้งค่า","Settings","设置")}</div>
            <div className="mob-drawer-settings">
              <button className="mob-setting-btn" onClick={()=>setDarkMode(d=>!d)}>
                {darkMode?"☀️":"🌙"} {darkMode?L$(lang,"โหมดสว่าง","Light","浅色"):L$(lang,"โหมดมืด","Dark","深色")}
              </button>
              <div className="mob-lang-select-wrap">
                <span className="mob-lang-icon">{LANGS[lang].label.split(" ")[0]}</span>
                <select className="mob-lang-select" value={lang} onChange={e=>setLang(e.target.value)}>
                  {Object.values(LANGS).map(l=>(
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* คู่มือการใช้งาน */}
            <button className="mob-drawer-item mob-manual-btn" onClick={()=>{setManualLang(lang);setShowManual(true);setMobileMenuOpen(false);}}>
              <span className="mob-drawer-icon">📄</span>
              <span>{L$(lang,"คู่มือการใช้งาน","User Manual","使用手册")}</span>
            </button>

            {/* Admin */}
            <button className="mob-drawer-item" onClick={()=>{setShowAdmin(true);setMobileMenuOpen(false);}}>
              <span className="mob-drawer-icon">📊</span>
              <span>Admin Dashboard</span>
            </button>

            {/* Clear all chats */}
            {sessions.length>0&&(
              <button className="mob-drawer-item mob-clear-btn" onClick={()=>{setDeleteModal("all");setMobileMenuOpen(false);}}>
                <span className="mob-drawer-icon">🗑️</span>
                <span>{L$(lang,"ลบแชททั้งหมด","Clear All Chats","清除全部对话")}</span>
              </button>
            )}
          </aside>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteModal&&(
        <div className="del-modal-overlay" onClick={()=>setDeleteModal(null)}>
          <div className="del-modal" onClick={e=>e.stopPropagation()}>
            <div className="del-modal-icon">🗑️</div>
            <h3 className="del-modal-title">{L$(lang,"ยืนยันการลบแชท","Delete Chat?","确认删除对话")}</h3>
            <p className="del-modal-desc">
              {L$(lang,
                `ลบ "${deleteModal.title||"แชทนี้"}" ใช่หรือไม่?
การกระทำนี้ไม่สามารถย้อนกลับได้`,
                `Delete "${deleteModal.title||"this chat"}"?
This action cannot be undone.`,
                `确认删除「${deleteModal.title||"此对话"}」？
此操作无法撤ษ。`
              )}
            </p>
            <div className="del-modal-btns">
              <button className="del-btn-cancel" onClick={()=>setDeleteModal(null)}>
                {L$(lang,"ยกเลิก","Cancel","取消")}
              </button>
              <button className="del-btn-confirm" onClick={()=>{
                deleteSession(deleteModal.id);
                setSessions(loadSessions());
                setDeleteModal(null);
                showToast(L$(lang,"ลบแชทเรียบร้อยแล้ว ✓","Chat deleted ✓","对话已删除 ✓"));
              }}>
                {L$(lang,"🗑️ ลบแชท","🗑️ Delete","🗑️ 删除")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {/* ── Emergency Modal ── */}
      {showEmergency&&(
        <div className="del-modal-overlay" onClick={()=>setShowEmergency(false)}>
          <div className="emg-modal" onClick={e=>e.stopPropagation()}>
            <div className="emg-modal-header">
              <span>🚨 {L$(lang,"เบอร์ฉุกเฉิน","Emergency Numbers","紧急求助")}</span>
              <button className="emg-close" onClick={()=>setShowEmergency(false)}>✕</button>
            </div>
            <div className="emg-modal-sub">{L$(lang,"กดโทรออกได้เลย","Tap to call directly","点击直接拨打")}</div>
            <div className="emg-list">
              <a href="tel:1155" className="emg-item">
                <div className="emg-icon-wrap">👮</div>
                <div className="emg-info">
                  <span className="emg-name">{L$(lang,"ตำรวจท่องเที่ยว","Tourist Police","旅游警察")}</span>
                  <span className="emg-number">1155</span>
                </div>
                <div className="emg-call-btn">📞 {L$(lang,"โทร","Call","拨打")}</div>
              </a>
              <a href="tel:191" className="emg-item">
                <div className="emg-icon-wrap">🚓</div>
                <div className="emg-info">
                  <span className="emg-name">{L$(lang,"ตำรวจ","Police","警察")}</span>
                  <span className="emg-number">191</span>
                </div>
                <div className="emg-call-btn">📞 {L$(lang,"โทร","Call","拨打")}</div>
              </a>
              <a href="tel:1669" className="emg-item">
                <div className="emg-icon-wrap">🚑</div>
                <div className="emg-info">
                  <span className="emg-name">{L$(lang,"พยาบาล / กู้ภัย","Ambulance / Rescue","救护车")}</span>
                  <span className="emg-number">1669</span>
                </div>
                <div className="emg-call-btn">📞 {L$(lang,"โทร","Call","拨打")}</div>
              </a>
            </div>
            <div className="emg-footer">{L$(lang,"บริการฟรีตลอด 24 ชั่วโมง","Free service 24/7","24小时免费服务")}</div>
          </div>
        </div>
      )}

      {/* ══ ONBOARDING MODAL — step-by-step ══ */}
      {showOnboarding&&(()=>{
        const OB_STEPS = [
          {
            icon:"💬", tab:null,
            th:{title:"สวัสดีค่ะ! ฉันชื่อน้องเพชร 👋",sub:"ไกด์ท่องเที่ยว AI เพชรบุรี–หัวหิน",desc:"ถามฉันได้ทุกเรื่องเกี่ยวกับสถานที่ท่องเที่ยว อาหาร การเดินทาง เวลาเปิด-ปิด ราคา และอื่นๆ อีกมากมายค่ะ"},
            en:{title:"Hi! I'm Nong Phet 👋",sub:"AI Tourism Guide · Phetchaburi & Hua Hin",desc:"Ask me anything: attractions, food, transport, opening hours, prices, local tips — I'm here 24/7!"},
            zh:{title:"你好！我是小碧 👋",sub:"碧武里–华欣 AI旅游助手",desc:"随时向我询问景点、美食、交通、开放时间、票价等任何旅游问题！"},
          },
          {
            icon:"📚", tab:"planner",
            th:{title:"📚 วางแผนทริป",sub:"สร้างตารางเที่ยวรายวันอัตโนมัติ",desc:"บอกจำนวนวัน ความสนใจ และเดินทางกับใคร — น้องเพชรจะสร้างแผนเที่ยวพร้อมสถานที่ อาหาร และที่พักให้เลยค่ะ"},
            en:{title:"📚 Trip Planner",sub:"Auto-generate day-by-day itineraries",desc:"Tell me how many days, your interests and travel group — I'll build a complete itinerary with places, food & hotels!"},
            zh:{title:"📚 行程规划",sub:"自动生成每日详细行程",desc:"告诉我天数、兴趣爱好和出行人数，小碧将为你生成包含景点、美食和住宿的完整行程！"},
          },
          {
            icon:"🎪", tab:"festival",
            th:{title:"🎪 เทศกาลและกิจกรรม",sub:"ปฏิทินเทศกาลประจำปี",desc:"ดูเทศกาลสำคัญของเพชรบุรีและหัวหินตลอดทั้งปี เลือกเดือนเพื่อดูรายละเอียดแต่ละเทศกาลได้เลยค่ะ"},
            en:{title:"🎪 Festivals & Events",sub:"Annual festival calendar",desc:"Browse Phetchaburi & Hua Hin festivals all year round. Tap a month to see event details and highlights!"},
            zh:{title:"🎪 节日活动",sub:"全年节日活动日历",desc:"浏览碧武里和华欣全年节日活动，点击月份查看每个节日的详细信息！"},
          },
          {
            icon:"🏨", tab:"accom",
            th:{title:"🏨 ค้นหาที่พัก",sub:"โรงแรม รีสอร์ท โฮมสเตย์",desc:"กรองที่พักตามงบประมาณ ประเภท และทำเล เปรียบเทียบข้อมูลและกดนำทางได้ทันทีค่ะ"},
            en:{title:"🏨 Find Accommodation",sub:"Hotels, resorts & homestays",desc:"Filter by budget, type and location. Compare details and get directions instantly!"},
            zh:{title:"🏨 查找住宿",sub:"酒店、度假村和民宿",desc:"按预算、类型和位置筛选住宿，比较详情并即时获取导航！"},
          },
          {
            icon:"💰", tab:"budget",
            th:{title:"💰 คำนวณงบประมาณ",sub:"ประเมินค่าใช้จ่ายทั้งทริป",desc:"ใส่จำนวนคน จำนวนคืน ประเภทที่พัก อาหาร และการเดินทาง — ระบบจะคำนวณยอดรวมเป็น บาท / หยวน / USD ให้เลยค่ะ"},
            en:{title:"💰 Budget Calculator",sub:"Estimate your total trip cost",desc:"Input travelers, nights, accommodation, food & transport — get your total in THB, CNY or USD instantly!"},
            zh:{title:"💰 预算计算器",sub:"估算全程旅行费用",desc:"输入人数、天数、住宿类型、餐饮和交通，即时获得泰铢、人民币或美元的总费用！"},
          },
        ];
        const step = OB_STEPS[obStep];
        const s = step[lang] || step.th;
        const isLast = obStep === OB_STEPS.length - 1;
        const close = ()=>{ setShowOnboarding(false); setObStep(0); };
        return (
          <div className="modal-overlay onboarding-overlay" onClick={close}>
            <div className="onboarding-modal" onClick={e=>e.stopPropagation()}>
              <button className="ob-close-x" onClick={close}>✕</button>
              <div className="ob-step-icon">{step.icon}</div>
              <h2 className="ob-title">{s.title}</h2>
              <p className="ob-subtitle">{s.sub}</p>
              <p className="ob-desc">{s.desc}</p>
              <div className="ob-dots">
                {OB_STEPS.map((_,i)=>(
                  <span key={i} className={`ob-dot${i===obStep?" active":""}`} onClick={()=>setObStep(i)}/>
                ))}
              </div>
              {isLast ? (
                <button className="ob-start-btn" onClick={()=>{ close(); }}>
                  {L$(lang,"เริ่มใช้งานเลย! 🌸","Get Started! 🌸","开始使用！🌸")}
                </button>
              ) : (
                <div className="ob-nav-row">
                  {obStep>0&&<button className="ob-back-btn" onClick={()=>setObStep(s=>s-1)}>{L$(lang,"← ก่อนหน้า","← Back","← 上一步")}</button>}
                  <button className="ob-next-btn" onClick={()=>setObStep(s=>s+1)}>{L$(lang,"ถัดไป →","Next →","下一步 →")}</button>
                </div>
              )}
              <p className="ob-skip" onClick={close}>{L$(lang,"ข้ามทั้งหมด","Skip","跳过")}</p>
            </div>
          </div>
        );
      })()}

      {/* ══ USER MANUAL MODAL ══ */}
      {showManual&&(
        <div className="modal-overlay manual-overlay" onClick={()=>setShowManual(false)}>
          <div className="manual-modal" onClick={e=>e.stopPropagation()}>
            <div className="manual-header">
              <div className="manual-lang-tabs">
                {[{code:"th",label:"🇹🇭 ไทย"},{code:"en",label:"🇬🇧 EN"},{code:"zh",label:"🇨🇳 中文"}].map(l=>(
                  <button key={l.code} className={`manual-lang-tab${manualLang===l.code?" active":""}`} onClick={()=>setManualLang(l.code)}>{l.label}</button>
                ))}
              </div>
              <div className="manual-header-actions">
                <button className="manual-print-btn" onClick={()=>{
                  const el = document.getElementById('manual-print-area');
                  if (!el) return;
                  const win = window.open('','_blank','width=800,height=600');
                  win.document.write('<html><head><title>คู่มือน้องเพชร</title>');
                  win.document.write('<style>body{font-family:Sarabun,sans-serif;font-size:14pt;padding:32px;color:#111;line-height:1.8;}h1,h2,h3{color:#5b21b6;}table{width:100%;border-collapse:collapse;margin:12px 0;}td{border:1px solid #ddd;padding:8px 10px;}img{max-width:80px;}ol{padding-left:20px;}@media print{body{padding:16px;}}</style>');
                  win.document.write('</head><body>');
                  win.document.write(el.innerHTML);
                  win.document.write('</body></html>');
                  win.document.close();
                  win.focus();
                  setTimeout(()=>win.print(),400);
                }}>🖨️ {L$(manualLang,"พิมพ์","Print","打印")}</button>
                <button className="manual-close-btn" onClick={()=>setShowManual(false)}>✕</button>
              </div>
            </div>
            <div className="manual-body" id="manual-print-area">
              {manualLang==="th"&&<ManualTH/>}
              {manualLang==="en"&&<ManualEN/>}
              {manualLang==="zh"&&<ManualZH/>}
            </div>
          </div>
        </div>
      )}

      {toast&&<div className="toast-notif">{toast}</div>}
    </div>
  );
}
