import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ══════════════════════════════════════════════
// PLACES DB (with GPS coords)
// ══════════════════════════════════════════════
const PLACES_DB = {
  // ══ สถานที่ท่องเที่ยว 20 แห่ง ══
  "เขาวัง":          { name:"พระนครคีรี (เขาวัง)",          image:"https://img2.pic.in.th/20240513b953e516db409961bed1e969525ebdae082030.jpg", desc:"พระราชวังโบราณบนยอดเขา สร้างสมัย ร.4 วิวพาโนรามาเมืองเพชรบุรี เปิด 08:30–16:30 น.", price:"150 บาท",         coords:{lat:13.11170,lng:99.93960}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "แก่งกระจาน":     { name:"อุทยานแห่งชาติแก่งกระจาน",     image:"https://travel.mthai.com/app/uploads/2016/09/DSC_2356.jpg",                   desc:"อุทยานใหญ่ที่สุดในไทย ดูนก ทะเลหมอก ล่องแพ แนะนำ พ.ย.–ม.ค.",                      price:"100–300 บาท",     coords:{lat:12.86670,lng:99.63330}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "ถ้ำเขาหลวง":     { name:"ถ้ำเขาหลวง",                    image:"https://img.thaicdn.net/u/2022/sutasinee/01/42.jpg",                          desc:"ถ้ำพระพุทธรูปศักดิ์สิทธิ์ แสงธรรมชาติสวยงามตอน 11.00 น.",                         price:"ฟรี",              coords:{lat:13.08330,lng:99.95000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "วัดมหาธาตุ":     { name:"วัดมหาธาตุวรวิหาร",             image:"https://upload.wikimedia.org/wikipedia/commons/3/32/WatMahathat.jpg",          desc:"วัดโบราณสไตล์เขมร ปรางค์สูงตระหง่าน อายุกว่า 700 ปี กลางเมืองเพชรบุรี",         price:"ฟรี",              coords:{lat:13.10950,lng:99.93780}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "ชายหาดชะอำ":     { name:"หาดชะอำ",                        image:"https://cbtthailand.dasta.or.th/upload-file-api/Resources/RelateAttraction/Images/RAT760040/2.jpeg", desc:"ชายหาดพักผ่อนยอดนิยม ทรายขาว อาหารทะเลสดตลอดแนว", price:"ฟรี", coords:{lat:12.79790,lng:99.96680}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "มฤคทายวัน":      { name:"พระราชนิเวศน์มฤคทายวัน",        image:"https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/03/20181203e60b18779c69f051872ce047b4ad437f171442.jpg", desc:"พระตำหนักไม้สักทองริมทะเล สร้างสมัย ร.6 สถาปัตยกรรมงดงาม", price:"100 บาท", coords:{lat:12.74100,lng:99.96100}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "หาดเจ้าสำราญ":   { name:"หาดเจ้าสำราญ",                   image:"https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/01/201812013de8a0df78bb5384e0ca4f180a832613160741.jpg", desc:"ชายหาดสงบเงียบ อาหารทะเลสด เหมาะพักผ่อน ห่างจากเมือง 15 กม.", price:"ฟรี", coords:{lat:13.01670,lng:100.05000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "วัดค้างคาว":      { name:"วัดถ้ำแกลงใน (วัดค้างคาว)",     image:"", desc:"ดูค้างคาวบินออกล้านตัวตอนพระอาทิตย์ตก สวยมาก ช่วง เม.ย.–ต.ค.",                  price:"ฟรี",              coords:{lat:13.14000,lng:99.98000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "อ่างเก็บน้ำ":     { name:"อ่างเก็บน้ำแก่งกระจาน",         image:"", desc:"ทะเลสาบในอุทยาน ล่องเรือชมวิว ตั้งแคมป์ริมน้ำ บรรยากาศธรรมชาติ 100%",           price:"รวมค่าเข้าอุทยาน", coords:{lat:12.83000,lng:99.63000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "ตลาดน้ำ":         { name:"ตลาดน้ำบ้านอัมพวา เพชรบุรี",    image:"", desc:"ตลาดน้ำวิถีชุมชน อาหารท้องถิ่น ของฝาก บรรยากาศย้อนยุค เสาร์–อาทิตย์",          price:"ฟรี",              coords:{lat:13.11000,lng:99.93000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "วัดยาง":          { name:"วัดยาง ณ รังสี",                 image:"", desc:"วัดเก่าแก่ พระนอนองค์ใหญ่ จิตรกรรมฝาผนังสวยงาม ใกล้ใจกลางเมือง",               price:"ฟรี",              coords:{lat:13.10500,lng:99.94000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "พิพิธภัณฑ์":      { name:"พิพิธภัณฑสถานแห่งชาติเพชรบุรี", image:"", desc:"โบราณวัตถุ ประวัติศาสตร์เพชรบุรี ตั้งแต่ยุคหิน–รัตนโกสินทร์",                   price:"30 บาท",          coords:{lat:13.11200,lng:99.94000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "น้ำตกห้วยแม่":    { name:"น้ำตกห้วยแม่ประจัน",             image:"", desc:"น้ำตกในอุทยานแก่งกระจาน มีหลายชั้น น้ำใสสะอาด เดินป่าสั้นๆ",                   price:"รวมค่าเข้าอุทยาน", coords:{lat:12.70000,lng:99.58000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "ดอยสวนสน":        { name:"ดอยสวนสน (ป่าสนเขาพนมผา)",      image:"", desc:"ป่าสนบนยอดเขา วิวทะเลหมอก อากาศเย็น ช่วง พ.ย.–ก.พ. สวยที่สุด",                 price:"ฟรี",              coords:{lat:12.78000,lng:99.55000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "วัดพระนอน":       { name:"วัดพระพุทธไสยาสน์",              image:"", desc:"พระนอนขนาดใหญ่ ศิลปะสวยงาม ใกล้เขาวัง 5 นาที",                                    price:"ฟรี",              coords:{lat:13.11500,lng:99.93500}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "ตลาดโต้รุ่ง":     { name:"ตลาดโต้รุ่งเพชรบุรี",            image:"", desc:"ตลาดกลางคืน ของกินหลากหลาย เปิดทุกคืน ตั้งแต่ทุ่มถึงตี 2 ราคาถูก",              price:"ฟรี",              coords:{lat:13.10000,lng:99.94500}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "แหลมหลวง":        { name:"แหลมหลวง (ชะอำ)",                image:"", desc:"จุดชมวิวทะเล พระอาทิตย์ขึ้น หาดทรายเงียบสงบ ห่างชะอำ 5 กม.",                    price:"ฟรี",              coords:{lat:12.77000,lng:99.97000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "เขาหลวง":         { name:"เขาหลวง (ชะอำ)",                 image:"", desc:"ยอดเขาวิวทะเล เดินป่าสั้นๆ ใช้เวลา 1 ชั่วโมง วิวสวยงาม",                       price:"ฟรี",              coords:{lat:12.80000,lng:99.95000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "สะพานจำลอง":      { name:"ชุมชนบ้านอุ้ม (สะพานแขวน)",     image:"", desc:"สะพานแขวนเก่าแก่ ชุมชนริมน้ำ ถ่ายรูปสวย บรรยากาศเงียบสงบ",                    price:"ฟรี",              coords:{lat:13.09000,lng:99.93000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },
  "หมู่บ้านถ้ำ":     { name:"หมู่บ้านถ้ำ อ.หนองหญ้าปล้อง",   image:"", desc:"ชุมชนรอบถ้ำ วิถีชีวิตท้องถิ่น ธรรมชาติสมบูรณ์ ห่างไกลนักท่องเที่ยว",         price:"ฟรี",              coords:{lat:13.20000,lng:99.77000}, mapsUrl:"https://maps.app.goo.gl/", type:"attraction" },

  // ══ ร้านอาหาร 20 ร้าน ══
  "ร้านขนมหม้อแกงโบราณ":{ name:"ขนมหม้อแกงบ้านนา",          image:"", desc:"ขนมหม้อแกงสูตรต้นตำรับ หอมมะพร้าวหวานกำลังดี ร้านเก่าแก่ดั้งเดิม",           price:"30–50 บาท/กล่อง", coords:{lat:13.11000,lng:99.93500}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ร้านริมน้ำ":      { name:"ร้านริมน้ำ (เพชรบุรี)",          image:"https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/03/20181203e60b18779c69f051872ce047b4ad437f171442.jpg", desc:"อาหารไทยริมแม่น้ำเพชร บรรยากาศดี เมนูแนะนำ: ต้มยำกุ้ง ปลาหมึกผัดกะเพรา", price:"150–400 บาท", coords:{lat:13.11000,lng:99.93500}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "อาหารทะเลเจ้าสำราญ":{ name:"อาหารทะเลเจ้าสำราญ",         image:"https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/01/201812013de8a0df78bb5384e0ca4f180a832613160741.jpg", desc:"อาหารทะเลสดหาดเจ้าสำราญ ปลาหมึกย่าง กุ้งทอดกระเทียม หอยนางรม", price:"200–500 บาท", coords:{lat:13.01670,lng:100.05000}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ข้าวแกงเพชร":     { name:"ร้านข้าวแกงเพชรบุรี (ตลาดใต้)",  image:"", desc:"ข้าวแกงป้าจุ๊ รสชาติบ้านๆ ต้มกะทิ แกงเขียวหวาน แน่นหนาราคาถูก",            price:"50–80 บาท",       coords:{lat:13.10500,lng:99.94200}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ก๋วยเตี๋ยวหมู":   { name:"ก๋วยเตี๋ยวหมูสด (ตลาดเช้า)",    image:"", desc:"ก๋วยเตี๋ยวหมูสดน้ำใสหอมกลิ่นตัง เปิดเช้า 6–11 โมง คนเมืองเพชรกินทุกวัน",    price:"40–60 บาท",       coords:{lat:13.11200,lng:99.93800}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ขนมจีนเพชรบุรี":  { name:"ขนมจีนแม่อรุณ",                  image:"", desc:"ขนมจีนน้ำยาปูสูตรโบราณ เส้นทำเองสด เครื่องเคียงครบ เปิดเช้า",                  price:"50–80 บาท",       coords:{lat:13.10800,lng:99.94000}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "โรตีมัทสยาม":     { name:"โรตีมัทสยาม (ชะอำ)",             image:"", desc:"โรตีกรอบสูตรเด็ด ไส้กล้วย ไข่ นมข้น ราคาถูก คนท้องถิ่นชอบมาก",              price:"20–40 บาท",       coords:{lat:12.79500,lng:99.96500}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ครัวสุดา":        { name:"ครัวสุดา ซีฟู้ด (ชะอำ)",          image:"", desc:"อาหารทะเลสดชะอำ ปูนิ่ม กุ้งแม่น้ำ วิวทะเล บรรยากาศดี",                       price:"200–600 บาท",     coords:{lat:12.80000,lng:99.96800}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "บะหมี่เป็ดย่าง":  { name:"บะหมี่เป็ดย่างเพชรบุรี",          image:"", desc:"บะหมี่เส้นสดต้มน้ำซุปเป็ดข้น เป็ดย่างนุ่ม รสชาติเข้มข้น",                    price:"60–80 บาท",       coords:{lat:13.10600,lng:99.94100}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ไอศครีมชาวเพชร":  { name:"ไอศครีมชาวเพชร (หน้าเขาวัง)",    image:"", desc:"ไอศครีมกะทิสดรสโบราณ ทำเองทุกวัน คนเพชรกินมา 40 ปี",                         price:"25–40 บาท",       coords:{lat:13.11300,lng:99.93700}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ปิ้งย่างหาดชะอำ": { name:"บาร์บีคิวริมหาดชะอำ",             image:"", desc:"ปิ้งย่างซีฟู้ดริมหาด เปิดเย็น บรรยากาศสบาย ลมทะเล กินแบบ casual",             price:"150–350 บาท",     coords:{lat:12.79800,lng:99.96700}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "หมูกระทะเพชร":    { name:"หมูกระทะเพชรบุรี (ตลาดโต้รุ่ง)", image:"", desc:"หมูกระทะบุฟเฟต์ราคาถูก เนื้อสด ผักสดใหม่ เปิดทุกคืน",                         price:"99–149 บาท",      coords:{lat:13.10000,lng:99.94500}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ส้มตำลาวเพชร":    { name:"ส้มตำลาวป้าแดง",                  image:"", desc:"ส้มตำสูตรอีสาน รสแซ่บ ปูปลาร้า ไก่ย่างหอม ราคาชาวบ้าน",                      price:"50–120 บาท",      coords:{lat:13.10200,lng:99.93600}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ร้านกาแฟเขาวัง":  { name:"คาเฟ่วิวเขาวัง",                  image:"", desc:"คาเฟ่วิวสวย มองเห็นเขาวัง กาแฟหอม เค้กโฮมเมด เหมาะถ่ายรูป",                  price:"80–150 บาท",      coords:{lat:13.11000,lng:99.93800}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ข้าวต้มเพชร":     { name:"ข้าวต้มเพชรบุรี (ร้านดัง)",        image:"", desc:"ข้าวต้มกุ้ง ปลา เนื้อ ต้มแบบโบราณน้ำใส เปิดตี 4 ถึงเที่ยง",                  price:"60–100 บาท",      coords:{lat:13.10800,lng:99.93900}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "สุกี้ชะอำ":       { name:"สุกี้ทะเลชะอำ",                   image:"", desc:"สุกี้น้ำซุปกุ้งสด เนื้อปลาสด หอยแมลงภู่ เปิดเย็นถึงดึก",                      price:"150–300 บาท",     coords:{lat:12.79200,lng:99.96400}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ผัดไทยเพชร":      { name:"ผัดไทยกุ้งสดเพชรบุรี",             image:"", desc:"ผัดไทยเส้นจันท์ กุ้งแม่น้ำสด ไข่ไก่ ถั่วงอก รสชาติจัดจ้าน",                 price:"80–120 บาท",      coords:{lat:13.10700,lng:99.94000}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ข้าวหมูแดงเพชร":  { name:"ข้าวหมูแดง หมูกรอบ (ตลาดเช้า)",   image:"", desc:"หมูแดงนุ่มราดซอสหอม หมูกรอบกรุบกริบ เปิดเช้าถึงเที่ยง",                     price:"50–80 บาท",       coords:{lat:13.11000,lng:99.94200}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "ของหวานเพชร":     { name:"ร้านของหวานเพชรบุรี (ตรอกเก่า)",   image:"", desc:"บัวลอย วุ้นกะทิ ขนมชั้น ทับทิมกรอบ สูตรโบราณดั้งเดิม",                      price:"30–60 บาท",       coords:{lat:13.10900,lng:99.93700}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },
  "seafood_chaosaman":{ name:"อาหารทะเลเจ้าสำราญ (สาขา 2)",    image:"https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/01/201812013de8a0df78bb5384e0ca4f180a832613160741.jpg", desc:"สาขา 2 ใกล้หาด เมนูเด็ด: ปูผัดผงกะหรี่ กุ้งเผา", price:"200–500 บาท", coords:{lat:13.02000,lng:100.04500}, mapsUrl:"https://maps.app.goo.gl/", type:"restaurant" },

  // ══ ที่พัก 30 แห่ง ══
  "dusit_huahin":    { name:"Dusit Thani Hua Hin",               image:"https://img2.pic.in.th/366880381.jpg",                                         desc:"5-star luxury resort ใกล้ชะอำ สระว่ายน้ำ สปา วิวทะเล", price:"3,500–8,000/คืน", coords:{lat:12.57060,lng:99.95780}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/hotel/th/dusit-thani-hua-hin.th.html", type:"hotel" },
  "kaeng_resort":    { name:"Kaeng Krachan Camp & Resort",        image:"https://img2.pic.in.th/643396939_904572975672909_3528937264899095705_n.jpg",  desc:"รีสอร์ทติดอุทยานแก่งกระจาน บรรยากาศธรรมชาติ ดูนกยามเช้า", price:"800–1,500/คืน", coords:{lat:12.85000,lng:99.60000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Kaeng+Krachan", type:"hotel" },
  "cha_am_resort":   { name:"Cha Am Methavalai Hotel",            image:"", desc:"โรงแรม 4 ดาวริมหาดชะอำ สิ่งอำนวยความสะดวกครบ เหมาะครอบครัว",          price:"2,000–3,500/คืน", coords:{lat:12.79500,lng:99.97000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Cha+Am+hotel",      type:"hotel" },
  "regent_chaam":    { name:"Regent Cha Am Beach Resort",         image:"", desc:"รีสอร์ทใหญ่ติดหาด สระว่ายน้ำ กีฬาทางน้ำ ร้านอาหาร เหมาะครอบครัว",    price:"1,800–3,200/คืน", coords:{lat:12.80500,lng:99.97100}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/hotel/th/regent-cha-am-beach.th.html",     type:"hotel" },
  "veranda_resort":  { name:"Veranda Resort Cha-Am",              image:"", desc:"รีสอร์ทวิวทะเล สไตล์โคโลเนียล สระว่ายน้ำอินฟินิตี้",                   price:"2,500–4,500/คืน", coords:{lat:12.80300,lng:99.97000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/hotel/th/veranda-resort-and-spa-hua-hin-cha-am.th.html", type:"hotel" },
  "beach_garden":    { name:"Beach Garden Hotel Cha Am",          image:"", desc:"โรงแรมสวนสวยริมหาด สระว่ายน้ำ ร้านอาหาร บรรยากาศผ่อนคลาย",            price:"1,200–2,200/คืน", coords:{lat:12.80100,lng:99.96900}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/hotel/th/beach-garden-cha-am.th.html",      type:"hotel" },
  "long_beach":      { name:"Long Beach Cha-Am Hotel",            image:"", desc:"โรงแรมริมหาดยาว สระว่ายน้ำ ห้องพักวิวทะเล ราคาคุ้มค่า",                 price:"900–1,800/คืน",   coords:{lat:12.79800,lng:99.97000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/hotel/th/long-beach-cha-am.th.html",        type:"hotel" },
  "rimnam_hotel":    { name:"โรงแรมริมเพชร (ในเมือง)",            image:"", desc:"ใจกลางเมืองเพชรบุรี ใกล้เขาวัง ตลาด สะดวกเดินทาง ราคาประหยัด",        price:"600–1,000/คืน",   coords:{lat:13.11000,lng:99.94000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Phetchaburi",      type:"hotel" },
  "phetburi_hotel":  { name:"เพชรบุรี ซิตี้ โฮเทล",              image:"", desc:"โรงแรมใหม่ใจกลางเมือง WiFi ฟรี ที่จอดรถ เหมาะทริปสั้น",                  price:"500–900/คืน",     coords:{lat:13.10800,lng:99.93800}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Phetchaburi",      type:"hotel" },
  "guesthouse_wang": { name:"เกสต์เฮ้าส์ใกล้เขาวัง",             image:"https://img2.pic.in.th/20240513b953e516db409961bed1e969525ebdae082030.jpg", desc:"เดินถึงเขาวัง 10 นาที ห้องสะอาด เจ้าของใจดี เหมาะแบกเป้", price:"400–700/คืน", coords:{lat:13.11400,lng:99.93600}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Phetchaburi+Khao+Wang", type:"hotel" },
  "rimnam_homestay": { name:"โฮมสเตย์ริมน้ำเพชร",                 image:"https://img2.pic.in.th/643396939_904572975672909_3528937264899095705_n.jpg", desc:"บ้านโฮมสเตย์ริมแม่น้ำ อาหารเช้าบ้านๆ บรรยากาศชิลล์", price:"400–650/คืน", coords:{lat:13.11100,lng:99.93400}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Phetchaburi", type:"hotel" },
  "kaeng_homestay":  { name:"บ้านพักธรรมชาติแก่งกระจาน",          image:"", desc:"โฮมสเตย์ติดป่า ดูนกยามเช้า อากาศบริสุทธิ์ ห่างไกลความวุ่นวาย",          price:"500–800/คืน",     coords:{lat:12.86000,lng:99.64000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Kaeng+Krachan",     type:"hotel" },
  "forest_resort":   { name:"Forest Hill Resort แก่งกระจาน",      image:"", desc:"รีสอร์ทกลางป่า ติดอุทยาน วิวภูเขา สระว่ายน้ำ เงียบสงบ",                 price:"900–1,600/คืน",   coords:{lat:12.87000,lng:99.62000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Forest+Hill+Kaeng", type:"hotel" },
  "cha_am_villa":    { name:"Cha Am Pool Villa",                   image:"", desc:"วิลล่าสระว่ายน้ำส่วนตัวชะอำ เหมาะกลุ่มเพื่อน/ครอบครัว ครัวส่วนตัว",  price:"2,000–4,000/คืน", coords:{lat:12.80200,lng:99.97100}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Pool+Villa+Cha+Am", type:"hotel" },
  "sunrise_chaam":   { name:"Sunrise Resort Cha Am",               image:"", desc:"รีสอร์ทติดทะเล ห้องวิวทะเล อาหารเช้าริมหาด ดูพระอาทิตย์ขึ้น",         price:"1,400–2,600/คืน", coords:{lat:12.80400,lng:99.97200}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Sunrise+Resort+Cha+Am", type:"hotel" },
  "palm_garden":     { name:"Palm Garden Resort Cha Am",           image:"", desc:"รีสอร์ทสวนปาล์มริมหาด สระว่ายน้ำ Wi-Fi ฟรี เหมาะครอบครัว",            price:"1,000–1,800/คืน", coords:{lat:12.79700,lng:99.97000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/hotel/th/palm-garden.th.html",               type:"hotel" },
  "amari_huahin":    { name:"Amari Hua Hin (ใกล้ชะอำ)",            image:"", desc:"โรงแรม 5 ดาว สระว่ายน้ำหลายชั้น สปา ห่างชะอำ 30 นาที",                  price:"3,000–6,000/คืน", coords:{lat:12.58000,lng:99.97000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/hotel/th/amari-hua-hin.th.html",             type:"hotel" },
  "imperial_chaam":  { name:"The Imperial Cha Am",                 image:"", desc:"โรงแรมคลาสสิคชะอำ สระว่ายน้ำ เทนนิส ร้านอาหาร บรรยากาศเงียบ",         price:"1,200–2,500/คืน", coords:{lat:12.80000,lng:99.96800}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/hotel/th/the-imperial-cha-am-beach.th.html", type:"hotel" },
  "baan_suan":       { name:"บ้านสวนรีสอร์ท เพชรบุรี",            image:"", desc:"รีสอร์ทสวนสวย บรรยากาศไทยๆ สระว่ายน้ำ เหมาะครอบครัว ราคาเป็นมิตร",    price:"700–1,200/คืน",   coords:{lat:13.10000,lng:99.93000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Baan+Suan+Phetchaburi", type:"hotel" },
  "eco_lodge":       { name:"Eco Lodge เพชรบุรี",                   image:"", desc:"ที่พักอิงธรรมชาติ วัสดุท้องถิ่น Solar cell eco-friendly",               price:"600–1,200/คืน",   coords:{lat:12.84000,lng:99.65000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Eco+Lodge+Phetchaburi", type:"hotel" },
  "sea_breeze":      { name:"Sea Breeze Resort Cha Am",             image:"", desc:"รีสอร์ทลมทะเล ริมหาด ราคาเป็นมิตร เหมาะกลุ่มเพื่อน",                   price:"800–1,500/คืน",   coords:{lat:12.80200,lng:99.96900}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Sea+Breeze+Cha+Am",   type:"hotel" },
  "khiri_wiang":     { name:"คีรีเวียง รีสอร์ท แก่งกระจาน",       image:"", desc:"รีสอร์ทวิวเขา ใกล้อุทยาน บรรยากาศสงบ เดินทางสะดวก",                   price:"700–1,300/คืน",   coords:{lat:12.88000,lng:99.61500}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Khiri+Wiang",         type:"hotel" },
  "mrigadayavan_h":  { name:"โรงแรมมฤคทายวัน (ชะอำ)",              image:"", desc:"เงียบสงบใกล้พระราชนิเวศน์มฤคทายวัน วิวทะเล ห้องพักสะอาด",             price:"800–1,400/คืน",   coords:{lat:12.74000,lng:99.96000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Mrigadayavan+Cha+Am", type:"hotel" },
  "baan_krating":    { name:"บ้านกระติ้ง (Baan Krating)",           image:"", desc:"รีสอร์ทธรรมชาติ วิวเขา อากาศเย็น เหมาะพักผ่อน ใกล้อุทยาน",            price:"600–1,200/คืน",   coords:{lat:12.86500,lng:99.61000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Baan+Krating",        type:"hotel" },
  "saimork_villa":   { name:"Saimork Villa (ชะอำ)",                 image:"", desc:"วิลล่าสงบงาม สระส่วนตัว บรรยากาศโรแมนติก เหมาะคู่รัก",                 price:"1,500–2,500/คืน", coords:{lat:12.80000,lng:99.97200}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Saimork+Villa",        type:"hotel" },
  "kaeng_camping":   { name:"แคมป์ปิ้งอุทยานแก่งกระจาน",           image:"", desc:"เต็นท์ริมอ่างเก็บน้ำ บรรยากาศธรรมชาติ 100% ต้องจองล่วงหน้า",           price:"100–300/คืน",     coords:{lat:12.83000,lng:99.63000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.thainationalparks.com/kaeng-krachan-national-park",        type:"hotel" },
  "nature_retreat":  { name:"Nature Retreat เพชรบุรี",              image:"", desc:"ที่พักกลางธรรมชาติ ใกล้แก่งกระจาน กิจกรรมเดินป่า ดูนก",                 price:"500–1,000/คืน",   coords:{lat:12.84500,lng:99.64000}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Nature+Retreat+Phetchaburi", type:"hotel" },
  "sand_sea":        { name:"Sand & Sea Resort Cha Am",             image:"", desc:"รีสอร์ทติดหาดทราย สระว่ายน้ำ กิจกรรมทางทะเล บรรยากาศสบาย",            price:"1,100–2,000/คืน", coords:{lat:12.80100,lng:99.96800}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Sand+Sea+Cha+Am",     type:"hotel" },
  "beach_villa":     { name:"Cha Am Beach Villa (กลุ่มใหญ่)",       image:"", desc:"วิลล่าริมหาด เหมาะกลุ่มใหญ่ ครัวส่วนตัว สระว่ายน้ำ 8–12 คน",          price:"2,500–5,000/คืน", coords:{lat:12.80300,lng:99.97200}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Beach+Villa+Cha+Am",  type:"hotel" },
  "cha_am_boutique": { name:"Cha Am Boutique Hotel",                image:"", desc:"โรงแรมบูติคสไตล์โมเดิร์น ใกล้หาด ออกแบบสวย Instagram-worthy",          price:"1,200–2,400/คืน", coords:{lat:12.79600,lng:99.96900}, mapsUrl:"https://maps.app.goo.gl/", booking:"https://www.booking.com/searchresults.th.html?ss=Boutique+Hotel+Cha+Am", type:"hotel" },
};

const TYPE_LABEL = { attraction:"🏛️ สถานที่", hotel:"🏨 ที่พัก", restaurant:"🍽️ ร้านอาหาร" };
const TYPE_EMOJI = { attraction:"🏛️", hotel:"🏨", restaurant:"🍽️" };

// ══════════════════════════════════════════════
// FESTIVAL DATA (เพชรบุรีเท่านั้น)
// ══════════════════════════════════════════════
const FESTIVALS = [
  { month:1,  name:"งานกาชาดเพชรบุรี",          date:"ม.ค. สัปดาห์ที่ 3",     location:"สนามกีฬาจังหวัดเพชรบุรี",  desc:"งานใหญ่ประจำปี มีการแสดง ร้านค้า อาหาร และกิจกรรมการกุศล จัดโดยสภากาชาดจังหวัด", icon:"🎪", highlight:true  },
  { month:2,  name:"งานพระนครคีรี–เดินแสง",     date:"ก.พ. สัปดาห์ที่ 1",     location:"พระนครคีรี (เขาวัง)",      desc:"แสง สี เสียง อันตระการตาบนเขาวัง วิวสวยที่สุดของปี ชมฟรี ไม่ต้องเสียค่าเข้า", icon:"✨", highlight:true  },
  { month:4,  name:"สงกรานต์เพชรบุรี",           date:"13–15 เม.ย.",            location:"ถนนสายหลัก / หาดชะอำ",    desc:"เล่นน้ำสงกรานต์สไตล์ท้องถิ่น มีขบวนแห่ และกิจกรรมรดน้ำผู้สูงอายุ", icon:"💦", highlight:true  },
  { month:5,  name:"วันวิสาขบูชาที่เขาวัง",      date:"ขึ้น 15 ค่ำ เดือน 6",   location:"พระนครคีรี",               desc:"เวียนเทียนบนเขาวัง บรรยากาศศักดิ์สิทธิ์ท่ามกลางแสงเทียนนับพัน", icon:"🕯️", highlight:false },
  { month:7,  name:"แข่งเรือยาวประเพณีเพชรบุรี", date:"ก.ค.–ส.ค.",             location:"แม่น้ำเพชรบุรี",           desc:"แข่งเรือยาวประเพณีโบราณที่สืบทอดมาหลายร้อยปี มีเรือชิงชนะเลิศ บรรยากาศสนุกสนาน", icon:"🚣", highlight:false },
  { month:9,  name:"งานกินเจเพชรบุรี",           date:"ต.ค. (9 วัน)",           location:"ชุมชนจีน ในเมืองเพชรบุรี", desc:"เดินเที่ยวกินเจ ร้านค้าอาหารมังสวิรัติเปิดทั่วเมือง บรรยากาศคึกคัก", icon:"🥬", highlight:false },
  { month:10, name:"ออกพรรษาแข่งเรือ",           date:"ขึ้น 15 ค่ำ เดือน 11",  location:"แม่น้ำเพชรบุรี",           desc:"ประเพณีออกพรรษาพร้อมการแข่งเรือพายแบบดั้งเดิม", icon:"🛶", highlight:false },
  { month:11, name:"ทอดกฐินเพชรบุรี",            date:"พ.ย.",                   location:"วัดทั่วจังหวัดเพชรบุรี",  desc:"ทอดกฐินสามัคคีวัดสำคัญในจังหวัด เช่น วัดมหาธาตุ วัดยาง วัดเพชรพลี", icon:"🙏", highlight:false },
  { month:12, name:"ปีใหม่ชะอำ",                 date:"31 ธ.ค.–1 ม.ค.",        location:"หาดชะอำ เพชรบุรี",         desc:"เคาท์ดาวน์ริมหาด มีคอนเสิร์ต ดอกไม้ไฟ ตลาดกลางคืน บรรยากาศสนุกสนาน", icon:"🎆", highlight:true  },
];
const MONTH_TH   = ["","ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const MONTH_EN   = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL = ["","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

// ══════════════════════════════════════════════
// ACCOMMODATION DATA (เพชรบุรีเท่านั้น)
// ══════════════════════════════════════════════
const ACCOMMODATIONS = [
  { id:1, name:"บ้านพักโฮมสเตย์ริมน้ำเพชร",     type:"homestay", location:"city",     price:400,  rating:4.2, image:"https://img2.pic.in.th/643396939_904572975672909_3528937264899095705_n.jpg", desc:"บรรยากาศชิลล์ริมแม่น้ำเพชรบุรี อาหารเช้ารวม เจ้าของใจดี", booking:"https://www.booking.com/searchresults.th.html?ss=Phetchaburi" },
  { id:2, name:"เกสต์เฮ้าส์ใกล้เขาวัง",         type:"homestay", location:"city",     price:500,  rating:4.0, image:"https://img2.pic.in.th/20240513b953e516db409961bed1e969525ebdae082030.jpg", desc:"เดินถึงเขาวัง 10 นาที ราคาถูก ห้องสะอาด เหมาะนักเดินทาง", booking:"https://www.booking.com/searchresults.th.html?ss=Phetchaburi+Khao+Wang" },
  { id:3, name:"โรงแรมริมเพชร",                  type:"hotel",    location:"city",     price:700,  rating:4.0, image:"https://upload.wikimedia.org/wikipedia/commons/3/32/WatMahathat.jpg", desc:"ใจกลางเมืองเพชรบุรี ใกล้ตลาด สะดวกเดินทางไปทุกที่", booking:"https://www.booking.com/searchresults.th.html?ss=Phetchaburi+city" },
  { id:4, name:"Kaeng Krachan Camp & Resort",    type:"resort",   location:"mountain", price:1200, rating:4.6, image:"https://travel.mthai.com/app/uploads/2016/09/DSC_2356.jpg", desc:"ติดอุทยานแก่งกระจาน บรรยากาศธรรมชาติ ดูนกยามเช้า ทะเลหมอก", booking:"https://www.booking.com/searchresults.th.html?ss=Kaeng+Krachan" },
  { id:5, name:"ชะอำ บีช รีสอร์ท",              type:"resort",   location:"beach",    price:1800, rating:4.3, image:"https://cbtthailand.dasta.or.th/upload-file-api/Resources/RelateAttraction/Images/RAT760040/2.jpeg", desc:"ติดหาดชะอำ สระว่ายน้ำ อาหารเช้าริมหาด วิวทะเลสวยงาม", booking:"https://www.booking.com/searchresults.th.html?ss=Cha+Am+Beach+Resort" },
  { id:6, name:"โรงแรมชะอำเมทรินี่",            type:"hotel",    location:"beach",    price:2500, rating:4.4, image:"https://img2.pic.in.th/366880381.jpg", desc:"โรงแรมริมทะเลชะอำ สิ่งอำนวยความสะดวกครบ เหมาะครอบครัว", booking:"https://www.booking.com/searchresults.th.html?ss=Cha+Am+hotel" },
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
    placeholder:"ถามน้องเพชรเรื่องเพชรบุรี...",
    welcome:"สวัสดีค่ะ! 🌿 ฉันชื่อ **น้องเพชร** ไกด์ท่องเที่ยวสำหรับจังหวัดเพชรบุรีโดยเฉพาะเลยค่ะ ✨\n\nอยากรู้เรื่องที่เที่ยว 🏛️ ของกินอร่อย 🍽️ ที่พักสวยๆ 🏨 หรือวิธีเดินทาง 🚗 ถามได้เลยนะคะ ไม่ต้องเกรงใจเลยจ้า!",
    newChat:"แชทใหม่", errorMsg:"❌ เกิดข้อผิดพลาด กรุณาตรวจสอบ Server และลองใหม่นะคะ",
    quotaMsg:"⚠️ ขณะนี้ AI ให้บริการเกินโควต้าต่อวันแล้วค่ะ 😔\n\nกรุณาลองใหม่อีกครั้งในวันพรุ่งนี้ค่ะ 🙏",
    plannerTab:"จัดทริป", chatTab:"แชท",
    plannerTitle:"วางแผนทริปเพชรบุรี", plannerSubtitle:"บอกความต้องการ แล้วปล่อยให้ AI จัดแผนให้!",
    days:"จำนวนวัน", interests:"ความสนใจ", travelWith:"เดินทางกับ",
    generateBtn:"✨ สร้างแผนทริป", generating:"⏳ กำลังวางแผน...",
    interestOptions:["🏔️ ภูเขา/ป่า","🏖️ ทะเล/ชายหาด","🏛️ ประวัติศาสตร์","🍽️ อาหาร/ของฝาก","🌅 พระอาทิตย์ตก","🦜 ดูนก"],
    travelOptions:["คนเดียว","คู่รัก","ครอบครัว","เพื่อนกลุ่ม"],
    quickMenu:[
      {icon:"📸",label:"สถานที่ถ่ายรูป",msg:"แนะนำสถานที่ถ่ายรูปสวยๆ ในเพชรบุรี"},
      {icon:"🍜",label:"ของกินยอดนิยม",msg:"ของกินยอดนิยมในเพชรบุรีมีอะไรบ้าง แนะนำร้านด้วยนะ?"},
      {icon:"🏨",label:"ที่พักแนะนำ",msg:"แนะนำที่พักในเพชรบุรีตามงบประมาณ"},
      {icon:"🚨",label:"เบอร์ฉุกเฉิน",msg:"เบอร์โทรฉุกเฉินและโรงพยาบาลในเพชรบุรี"},
      {icon:"🎭",label:"กิจกรรม",msg:"กิจกรรมเชิงวัฒนธรรมในเพชรบุรีมีอะไรบ้าง?"},
      {icon:"👔",label:"มารยาทวัด",msg:"การแต่งกายเข้าวัดและมารยาทสำคัญในเพชรบุรี"},
      {icon:"💰",label:"คำนวณงบ",msg:"ช่วยประมาณค่าใช้จ่ายเที่ยวเพชรบุรี 2 วัน 1 คืน"},
      {icon:"🎪",label:"เทศกาล",msg:"เทศกาลและงานประจำปีในเพชรบุรีมีอะไรบ้าง?"},
    ],
    sidebarItems:[
      {icon:"🏛️",label:"สถานที่ท่องเที่ยว",msg:"แนะนำสถานที่ท่องเที่ยวทั้งหมดในเพชรบุรี"},
      {icon:"🍽️",label:"ร้านอาหาร",msg:"แนะนำร้านอาหารยอดนิยมในเพชรบุรี"},
      {icon:"🌤️",label:"ฤดูกาลท่องเที่ยว",msg:"ช่วงเวลาที่เหมาะสมในการท่องเที่ยวเพชรบุรีคือเมื่อไหร่?"},
      {icon:"🚌",label:"การเดินทาง",msg:"วิธีเดินทางจากกรุงเทพไปเพชรบุรีมีอะไรบ้าง?"},
      {icon:"🏕️",label:"แก่งกระจาน",msg:"อุทยานแห่งชาติแก่งกระจานมีอะไรน่าสนใจบ้าง?"},
      {icon:"🍮",label:"ขนมหม้อแกง",msg:"ขนมหม้อแกงเพชรบุรี ราคาเท่าไหร่ ซื้อได้ที่ไหน?"},
    ],
    suggestions:["🏛️ ที่เที่ยวแนะนำ?","🍜 ของกินยอดนิยม?","🚗 เดินทางยังไง?","📅 ช่วงไหนดีที่สุด?"],
    showMenu:"แสดงเมนูด่วน", hideMenu:"ซ่อนเมนูด่วน", directions:"นำทาง", mapView:"แผนที่",
  },
  en: {
    code:"en", label:"🇬🇧 EN",
    placeholder:"Ask about Phetchaburi...",
    welcome:"Hello! 🌿 I'm **Nong Phet**, your AI travel guide for Phetchaburi.\n\nAsk me about attractions 🏛️, food 🍽️, accommodation 🏨, or transport 🚗!",
    newChat:"New Chat", errorMsg:"❌ An error occurred. Please check the server and try again.",
    quotaMsg:"⚠️ AI service has reached its daily quota limit 😔\n\nPlease try again tomorrow 🙏",
    plannerTab:"Plan Trip", chatTab:"Chat",
    plannerTitle:"Plan Your Phetchaburi Trip", plannerSubtitle:"Tell us your preferences and let AI plan for you!",
    days:"Days", interests:"Interests", travelWith:"Travelling With",
    generateBtn:"✨ Generate Itinerary", generating:"⏳ Planning...",
    interestOptions:["🏔️ Mountain/Forest","🏖️ Beach/Sea","🏛️ History","🍽️ Food/Souvenirs","🌅 Sunset","🦜 Birdwatching"],
    travelOptions:["Solo","Couple","Family","Friends"],
    quickMenu:[
      {icon:"📸",label:"Photo Spots",msg:"Best photography spots in Phetchaburi"},
      {icon:"🍜",label:"Popular Food",msg:"Most popular food and must-eat dishes in Phetchaburi"},
      {icon:"🏨",label:"Accommodation",msg:"Accommodation recommendations by budget"},
      {icon:"🚨",label:"Emergency",msg:"Emergency numbers and hospitals in Phetchaburi"},
      {icon:"🎭",label:"Activities",msg:"Cultural activities in Phetchaburi"},
      {icon:"👔",label:"Etiquette",msg:"Temple dress code and etiquette"},
      {icon:"💰",label:"Budget",msg:"Estimate travel expenses for 2 days"},
      {icon:"🎪",label:"Festivals",msg:"Annual festivals in Phetchaburi"},
    ],
    sidebarItems:[
      {icon:"🏛️",label:"Attractions",msg:"All tourist attractions in Phetchaburi"},
      {icon:"🍽️",label:"Restaurants",msg:"Top restaurants in Phetchaburi"},
      {icon:"🌤️",label:"Best Season",msg:"Best time to visit Phetchaburi?"},
      {icon:"🚌",label:"Transport",msg:"How to get from Bangkok to Phetchaburi?"},
      {icon:"🏕️",label:"Kaeng Krachan",msg:"What's great about Kaeng Krachan National Park?"},
      {icon:"🍮",label:"Khanom Mo Kaeng",msg:"What is Khanom Mo Kaeng and where to buy it?"},
    ],
    suggestions:["🏛️ Top attractions?","🍮 Famous food?","🚗 Getting there?","📅 Best season?"],
    showMenu:"Show Quick Menu", hideMenu:"Hide Quick Menu", directions:"Navigate", mapView:"Map",
  },
  zh: {
    code:"zh", label:"🇨🇳 中文",
    placeholder:"询问碧武里旅游...",
    welcome:"您好！🌿 我是**小碧**，您的碧武里AI旅游向导。\n\n可以问我景点 🏛️、美食 🍽️、住宿 🏨 或交通 🚗！",
    newChat:"新对话", errorMsg:"❌ 发生错误，请检查服务器后重试。",
    quotaMsg:"⚠️ AI服务已达到每日配额限制 😔\n\n请明天再试 🙏",
    plannerTab:"行程规划", chatTab:"聊天",
    plannerTitle:"碧武里行程规划", plannerSubtitle:"告诉我们您的需求，让AI为您规划！",
    days:"天数", interests:"兴趣", travelWith:"出行方式",
    generateBtn:"✨ 生成行程", generating:"⏳ 规划中...",
    interestOptions:["🏔️ 山/森林","🏖️ 海滩","🏛️ 历史","🍽️ 美食/纪念品","🌅 日落","🦜 观鸟"],
    travelOptions:["独行","情侣","家庭","朋友"],
    quickMenu:[
      {icon:"📸",label:"拍照胜地",msg:"碧武里最佳拍照地点推荐"},
      {icon:"🍜",label:"热门美食",msg:"碧武里最受欢迎的美食有哪些，推荐餐厅？"},
      {icon:"🏨",label:"住宿推荐",msg:"按预算推荐碧武里住宿"},
      {icon:"🚨",label:"紧急联系",msg:"碧武里紧急电话和医院信息"},
      {icon:"🎭",label:"文化活动",msg:"碧武里有哪些文化体验活动？"},
      {icon:"👔",label:"寺庙礼仪",msg:"参观碧武里寺庙的着装要求和礼仪"},
      {icon:"💰",label:"预算计算",msg:"帮我估算1人在碧武里游玩2天的费用"},
      {icon:"🎪",label:"节庆活动",msg:"碧武里有哪些年度节庆？"},
    ],
    sidebarItems:[
      {icon:"🏛️",label:"所有景点",msg:"碧武里所有旅游景点介绍"},
      {icon:"🍽️",label:"餐厅推荐",msg:"碧武里热门餐厅推荐"},
      {icon:"🌤️",label:"最佳季节",msg:"碧武里最佳旅游时间是什么时候？"},
      {icon:"🚌",label:"交通方式",msg:"从曼谷到碧武里怎么去？"},
      {icon:"🏕️",label:"凯恩格拉占",msg:"凯恩格拉占国家公园有什么特色？"},
      {icon:"🍮",label:"椰奶蛋糕",msg:"碧武里椰奶蛋糕在哪里买？多少钱？"},
    ],
    suggestions:["🏛️ 推荐景点？","🍜 热门美食？","🚗 怎么去？","📅 最佳季节？"],
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
        () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.coords.lat},${place.coords.lng}`,"_blank")
      );
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.coords.lat},${place.coords.lng}`,"_blank");
    }
  };

  const openMapView = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${place.coords.lat},${place.coords.lng}`,"_blank");
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
        <span className="place-card-type">{TYPE_LABEL[place.type]||place.type}</span>
      </div>
      <div className="place-card-body">
        <h4 className="place-card-name">{place.name}</h4>
        <p className="place-card-desc">{place.desc}</p>
        <div className="place-card-price">💰 {place.price}</div>
        <div className="place-card-actions">
          <button onClick={openMapView}  className="place-card-btn view-btn">🗺️ {L.mapView}</button>
          <button onClick={openNavigate} className="place-card-btn map-btn">📍 {L.directions}</button>
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
      <div className="msg-avatar">🌿</div>
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
      {msg.role==="bot" && <div className="msg-avatar">{msg.isQuota?"⚠️":"🌿"}</div>}
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
                  {lang==="en"?MONTH_EN[month]:MONTH_TH[month]}
                  {month===curMonth&&<span className="now-badge">{L$(lang,"ตอนนี้","Now","当前")}</span>}
                </div>
                <div className="calendar-events-preview">
                  {events.length===0
                    ? <span className="no-event">–</span>
                    : events.map((e,i)=>(
                        <div key={i} className={`event-dot ${e.highlight?"highlight":""}`}>
                          <span>{e.icon}</span><span className="event-dot-name">{e.name}</span>
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
              {lang==="en"?MONTH_EN[selectedMonth]:MONTH_FULL[selectedMonth]} — {filtered.filter(f=>f.month===selectedMonth).length} {L$(lang,"งาน","event","活动")}
            </div>
            <div className="festival-cards">
              {filtered.filter(f=>f.month===selectedMonth).map((fest,i)=>(
                <div key={i} className={`festival-card ${fest.highlight?"highlight":""}`} onClick={()=>setSelectedFest(fest)}>
                  <div className="festival-card-icon">{fest.icon}</div>
                  <div className="festival-card-body">
                    <div className="festival-card-name">{fest.name}</div>
                    <div className="festival-card-date">📅 {fest.date}</div>
                    <div className="festival-card-location">📍 {fest.location}</div>
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
            <h3 className="modal-title">{selectedFest.name}</h3>
            <div className="modal-info">
              <div>📅 <strong>{L$(lang,"วันที่","Date","日期")}:</strong> {selectedFest.date}</div>
              <div>📍 <strong>{L$(lang,"สถานที่","Location","地点")}:</strong> {selectedFest.location}</div>
            </div>
            <p className="modal-desc">{selectedFest.desc}</p>
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
        <td style="padding:8px 14px;border-bottom:1px solid #e0f0e6;font-weight:700;color:#1e4d35;text-align:center">${item.count}</td>
        <td style="padding:8px 14px;border-bottom:1px solid #e0f0e6;font-size:0.8rem;color:#666;text-align:center">${new Date(item.last).toLocaleDateString('th-TH')}</td>
      </tr>`).join('');
    const html = `<!DOCTYPE html><html lang="th"><head>
      <meta charset="UTF-8">
      <title>FAQ Dashboard — น้องเพชร</title>
      <style>
        body{font-family:'Sarabun',sans-serif;padding:32px 40px;color:#1a2e1a;font-size:14px}
        h1{color:#1e4d35;font-size:1.6rem;margin-bottom:4px}
        .sub{color:#666;font-size:0.85rem;margin-bottom:20px}
        .stats{display:flex;gap:16px;margin-bottom:24px}
        .stat{background:#f0faf4;border-radius:10px;padding:14px 22px;text-align:center;border:1px solid #c8e6c9}
        .stat-n{font-size:2rem;font-weight:700;color:#1e4d35;line-height:1}
        .stat-l{font-size:0.72rem;color:#666;margin-top:4px}
        table{width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;box-shadow:0 1px 8px rgba(30,77,53,0.08)}
        thead tr{background:#1e4d35;color:white}
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
      <div class="footer">น้องเพชร AI Travel Guide — Phetchaburi Province</div>
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
  const pageRef = React.useRef(null);
  React.useEffect(()=>{
    const el = pageRef.current;
    if (!el) return;
    const onScroll = () => { if (el.scrollTop > 60) setCollapsed(true); };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  const toggleArr = (arr,set,val) => set(p=>p.includes(val)?p.filter(x=>x!==val):[...p,val]);

  const filtered = ACCOMMODATIONS.filter(a=>
    a.price<=maxPrice &&
    (typeFilter.length===0||typeFilter.includes(a.type)) &&
    (locFilter.length===0||locFilter.includes(a.location))
  );

  const TYPES = { hotel:{icon:"🏨",th:"โรงแรม",en:"Hotel",zh:"酒店"}, resort:{icon:"🌴",th:"รีสอร์ท",en:"Resort",zh:"度假村"}, homestay:{icon:"🏡",th:"โฮมสเตย์",en:"Homestay",zh:"民宿"} };
  const LOCS  = { city:{icon:"🏙️",th:"ในเมือง",en:"City Center",zh:"市中心"}, beach:{icon:"🏖️",th:"ริมทะเล",en:"Beachfront",zh:"海滨"}, mountain:{icon:"🏔️",th:"ใกล้อุทยาน",en:"Near Park",zh:"近公园"} };

  return (
    <div className="accom-page" ref={pageRef}>
      <div className="accom-inner">
        <div className="accom-hero">
          <h2>🏨 {L$(lang,"ค้นหาที่พักในเพชรบุรี","Find Stays in Phetchaburi","碧武里住宿搜索")}</h2>
          <p>{L$(lang,"กรองตามงบ ประเภท และทำเล — ทุกที่พักอยู่ในจังหวัดเพชรบุรี","Filter by budget, type & location — all properties in Phetchaburi","按预算、类型和位置筛选")}</p>
        </div>
        <div className="accom-layout">
          <div className="accom-filters">
            <div className="filter-collapse-header" onClick={()=>setCollapsed(p=>!p)}>
              <span>🔍 {L$(lang,"ตัวกรอง","Filters","筛选")}</span>
              <span style={{fontSize:"0.75rem"}}>{collapsed?"▼ แสดง":"▲ ซ่อน"}</span>
            </div>
            {!collapsed && <>
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
            </>}
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
                      <div className="accom-card-img-placeholder" style={{display:"none"}}>{TYPES[a.type]?.icon}</div>
                      <span className="accom-type-badge">{TYPES[a.type]?.icon} {L$(lang,TYPES[a.type]?.th,TYPES[a.type]?.en,TYPES[a.type]?.zh)}</span>
                      <span className="accom-loc-badge">{LOCS[a.location]?.icon} {L$(lang,LOCS[a.location]?.th,LOCS[a.location]?.en,LOCS[a.location]?.zh)}</span>
                    </div>
                    <div className="accom-card-body">
                      <div className="accom-card-header">
                        <h4 className="accom-name">{a.name}</h4>
                        <div className="accom-rating">⭐ {a.rating}</div>
                      </div>
                      <p className="accom-desc">{a.desc}</p>
                      <div className="accom-price">฿{a.price.toLocaleString()}<span>{L$(lang,"/คืน","/night","/晚")}</span></div>
                      <div className="accom-btns">
                        
                        <a href={a.booking} target="_blank" rel="noreferrer" className="accom-btn booking-btn">📋 Booking.com</a>
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
// MAIN APP
// ══════════════════════════════════════════════
export default function App() {
  const [lang, setLang]               = useState("th");
  const [darkMode, setDarkMode]       = useState(isNightTime());
  const [autoNight, setAutoNight]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab]     = useState("chat");
  const [showQuickMenu, setShowQuickMenu] = useState(true);
  const [showLangMenu, setShowLangMenu]   = useState(false);
  const [showAdmin, setShowAdmin]         = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessions, setSessions]           = useState(()=>loadSessions());
  const L = LANGS[lang];

  const [messages, setMessages] = useState([{role:"bot",text:LANGS["th"].welcome}]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sessionId]             = useState(()=>`session_${Date.now()}`);
  const bottomRef = useRef(null);

  useEffect(()=>{ if(!autoNight)return; const i=setInterval(()=>setDarkMode(isNightTime()),60000); return ()=>clearInterval(i); },[autoNight]);
  useEffect(()=>{ document.documentElement.classList.toggle("dark",darkMode); },[darkMode]);
  useEffect(()=>{ setMessages([{role:"bot",text:LANGS[lang].welcome}]); },[lang]);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);

  const newChat = () => { setMessages([{role:"bot",text:LANGS[lang].welcome}]); setInput(""); };

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

  const tabTitles = { chat:"💬 "+L.chatTab, planner:"📚 "+L.plannerTab, festival:"🎪 "+(lang==="th"?"เทศกาล":lang==="zh"?"节庆":"Festivals"), accom:"🏨 "+(lang==="th"?"ที่พัก":lang==="zh"?"住宿":"Stays") };
  // Nav icons (sidebar only — NOT reused in topbar to avoid duplication)
  const NAV_ICONS = { chat:"💬", planner:"📚", festival:"🎪", accom:"🏨" };

  return (
    <div className={`dashboard ${darkMode?"dark":""} ${sidebarOpen?"sidebar-open":"sidebar-closed"}`}>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="brand-icon">🌿</span>
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
                  <button className="history-load" onClick={()=>setMessages(sess.messages)}>
                    💬 {sess.title}
                  </button>
                  <button className={`history-star ${sess.starred?"starred":""}`}
                    onClick={()=>{toggleStar(sess.id);setSessions(loadSessions());}}>
                    {sess.starred?"⭐":"☆"}
                  </button>
                  <button className="history-del" title="ลบ"
                    onClick={()=>{if(window.confirm("ลบประวัติแชทนี้?")){deleteSession(sess.id);setSessions(loadSessions());}}}>
                    ✕
                  </button>
                </div>
              ))}
            </nav>
          </>)}

          {/* Settings */}
          <div className="sidebar-bottom">
            <div className="sidebar-section-label">{L$(lang,"การตั้งค่า","Settings","设置")}</div>
            <div className="lang-selector-side">
              <button className="nav-item" onClick={()=>setShowLangMenu(s=>!s)}>
                <span>{LANGS[lang].label.split(" ")[0]}</span>
                <span className="nav-label">{LANGS[lang].label.split(" ")[1]} ▾</span>
              </button>
              {showLangMenu&&(
                <div className="lang-dropdown">
                  {Object.values(LANGS).map(l=>(
                    <button key={l.code} className={`lang-opt ${lang===l.code?"active":""}`}
                      onClick={()=>{setLang(l.code);setShowLangMenu(false);}}>{l.label}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="nav-item" onClick={()=>{setAutoNight(false);setDarkMode(d=>!d);}}>
              <span>{darkMode?"☀️":"🌙"}</span><span className="nav-label">{darkMode?"Light Mode":"Dark Mode"}</span>
            </button>
            <button className="nav-item" onClick={()=>setShowAdmin(true)}>
              <span>📊</span><span className="nav-label">Admin</span>
            </button>
          </div>
        </>)}

        {!sidebarOpen&&(
          <div className="sidebar-icons">
            <button className="icon-btn" onClick={newChat}>✏️</button>
            <button className={`icon-btn ${activeTab==="chat"?"active":""}`}     onClick={()=>setActiveTab("chat")}>💬</button>
            <button className={`icon-btn ${activeTab==="planner"?"active":""}`}  onClick={()=>setActiveTab("planner")}>📚</button>
            <button className={`icon-btn ${activeTab==="festival"?"active":""}`} onClick={()=>setActiveTab("festival")}>🎪</button>
            <button className={`icon-btn ${activeTab==="accom"?"active":""}`}    onClick={()=>setActiveTab("accom")}>🏨</button>
            <button className="icon-btn" onClick={()=>{setAutoNight(false);setDarkMode(d=>!d);}}>{darkMode?"☀️":"🌙"}</button>
          </div>
        )}
      </aside>

      {/* ── MAIN ── */}
      <main className="main-area">
        <header className="topbar">
          {/* PC left */}
          <div className="topbar-left">
            <span className="topbar-title">{NAV_ICONS[activeTab]||"💬"} {activeTab==="chat"?L.chatTab:activeTab==="planner"?L.plannerTab:activeTab==="festival"?(lang==="th"?"เทศกาล":lang==="zh"?"节庆":"Festivals"):(lang==="th"?"ที่พัก":lang==="zh"?"住宿":"Stays")}</span>
            {activeTab==="chat"&&autoNight&&darkMode&&<span className="night-pill">🌙 Auto Dark</span>}
          </div>
          {/* Mobile: hamburger left + title center + new-chat right */}
          <button className="mob-hamburger" onClick={()=>setMobileMenuOpen(true)} aria-label="Menu">
            <span/><span/><span/>
          </button>
          <span className="mob-title">🌿 น้องเพชร</span>
          <div className="topbar-right">
            {activeTab==="chat"&&(
              <button className="qm-toggle-btn" onClick={()=>setShowQuickMenu(s=>!s)}>
                {showQuickMenu?L.hideMenu:L.showMenu}
              </button>
            )}
            <button className="new-chat-btn-top" onClick={newChat}>✏️ <span className="btn-label-pc">{L.newChat}</span></button>
          </div>
        </header>

        {activeTab==="chat" ? (
          <div className="chat-layout">
            <div className="messages-area">
              {isWelcome&&(
                <div className="welcome-screen">
                  <div className="welcome-avatar">🌿</div>
                  <h1>{L$(lang,"สวัสดีค่ะ! ฉันคือน้องเพชร 🌿","Hello! I'm Nong Phet","您好！我是小碧")}</h1>
                  <p>{L$(lang,"ไกด์ท่องเที่ยว AI สำหรับจังหวัดเพชรบุรี","AI Tourism Guide for Phetchaburi","碧武里AI旅游向导")}</p>
                  <div className="welcome-chips">
                    {L.suggestions.map((q,i)=><button key={i} className="welcome-chip" onClick={()=>sendMessage(q)}>{q}</button>)}
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
        ) : null}
      </main>

      {showAdmin&&<AdminDashboard onClose={()=>setShowAdmin(false)}/>}

      {/* ── MOBILE DRAWER (Claude-style slide-in) ── */}
      {mobileMenuOpen&&(
        <div className="mob-overlay" onClick={()=>setMobileMenuOpen(false)}>
          <aside className="mob-drawer" onClick={e=>e.stopPropagation()}>
            {/* Drawer header */}
            <div className="mob-drawer-header">
              <span className="mob-drawer-brand">🌿 น้องเพชร</span>
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
                  <button className="mob-drawer-item mob-hist-load"
                    onClick={()=>{setMessages(sess.messages);setActiveTab("chat");setMobileMenuOpen(false);}}>
                    <span className="mob-drawer-icon">💬</span>
                    <span className="mob-hist-title">{sess.title}</span>
                  </button>
                  <button className="mob-hist-del"
                    onClick={()=>{if(window.confirm("ลบ?")){deleteSession(sess.id);setSessions(loadSessions());}}}>✕</button>
                </div>
              ))}
            </>)}

            {/* Settings */}
            <div className="mob-drawer-section">{L$(lang,"ตั้งค่า","Settings","设置")}</div>
            <div className="mob-drawer-settings">
              <button className="mob-setting-btn" onClick={()=>setDarkMode(d=>!d)}>
                {darkMode?"☀️":"🌙"} {darkMode?L$(lang,"โหมดสว่าง","Light","浅色"):L$(lang,"โหมดมืด","Dark","深色")}
              </button>
              {["th","en","zh"].map(l=>(
                <button key={l} className={`mob-setting-btn ${lang===l?"active":""}`} onClick={()=>setLang(l)}>
                  {l==="th"?"🇹🇭 ไทย":l==="en"?"🇬🇧 EN":"🇨🇳 中"}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
