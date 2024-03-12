import { useState } from "react";
import xlsx from "json-as-xlsx";
import cityCode from "./cityCode";

function App() {
  const [nationalId, setNationalId] = useState("");
  const [nationalIdProvince, setNationalIdProvince] = useState("");
  const [nationalIdCity, setNationalIdCity] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [nationalIdCount, setNationalIdCount] = useState(1);
  const [selectedCity,setSelectedCity] = useState("105")
  const [onlySelectedCity,setOnlySelectedCity] = useState(false) ; 

  function nationalIdGenerator() {
    var list = [],
    sum = 0;
    
    for (var i = 10; i > 1; i--) {
    var j = Math.floor(Math.random() * Math.floor(10));
    list.push(j);
    sum += j * i;
    }
    
    var s = sum % 11;
    if (s < 2) {
    list.push(s);
    } else if (s >= 2) {
    list.push(11 - s);
    }
    
    const nationalId = list.join("");
    const city = cityCode[`${nationalId.slice(0, 3)}`];
    
    if (onlySelectedCity) {
    if (selectedCity === nationalId.slice(0, 3)) {
    return {
    nationalId: nationalId,
    city: city?.[1] ?? "نا مشخص",
    province: city?.[0] ?? "نا مشخص",
    };
    } else {
    return nationalIdGenerator();
    }
    } else {
    if (city?.[1] && city?.[0]) {
    setNationalId(nationalId);
    setNationalIdCity(city?.[1]);
    setNationalIdProvince(city?.[0]);
    
    return {
    nationalId: nationalId,
    city: city?.[1] ?? "نا مشخص",
    province: city?.[0] ?? "نا مشخص",
    };
    } else {
    return nationalIdGenerator();
    }
    }
    }

  function nationalIdRoundGenerator() {
    var list = [],
      sum = 0;
    var j = 10;
    for (var i = 10; i > 1; i--) {
      j = Math.floor(Math.random() * Math.floor(j < 2 ? 2 : j));
      list.push(j);
      sum += j * i;
    }

    var s = sum % 11;
    if (s < 2) {
      list.push(s);
    } else if (s >= 2) {
      list.push(11 - s);
    }
    if (
      list.filter(function (a) {
        return a != list[0];
      }).length == 0
    ) {
      return nationalIdRoundGenerator();
    }

    const nationalId = list.join("") ; 
    const city = cityCode[`${nationalId.slice(0, 3)}`]

      if(city?.[1] && city?.[0]){
        setNationalId(nationalId);
        setNationalIdCity(city?.[1]);
        setNationalIdProvince(city?.[0]);
      }else{
        nationalIdRoundGenerator(false) ; 
      }
    
  }

  let settings = {
    fileName: `فایل کد ملی مورخ ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} ${onlySelectedCity ? `شهر ${cityCode?.[selectedCity]}` : ''}`,
    extraLength: 3,
    writeMode: "writeFile",
    RTL: true,
  };

  return (
    <div className="min-h-dvh bg-indigo-950 flex flex-col gap-4 justify-center items-center text-white">
      <h1 className="xl:text-4xl text-xl">تولید کننده کد ملی</h1>
      <div className="grid md:grid-cols-2 grid-cols-1 max-w-[30rem] gap-4">
        <button
          className="p-2 border bg-indigo-800 rounded-lg"
          onClick={()=>{
            nationalIdGenerator()
          }}
        >
          تولید کد ملی
        </button>
        <button
          className="p-2 border bg-indigo-800 rounded-lg"
          onClick={nationalIdRoundGenerator}
        >
          تولید کد ملی رند
        </button>
      </div>
      {nationalId ? (
        <div className="text-xl flex flex-col gap-4 items-center">
          <p>کد ملی :</p>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <p className="rounded-full border-2 p-2 flex items-center justify-center">
              {nationalId}{" "}
              {nationalIdProvince ? `- ${nationalIdProvince}` : null}{" "}
              {nationalIdCity ? `- ${nationalIdCity}` : null}
            </p>
            <div
              className="flex items-center justify-center gap-4 rounded-full border-2 p-2 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(nationalId);
              }}
            >
              <p className="mb-2">کپی کردن</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="white"
                  strokeWidth="1.5"
                  d="M6 11c0-2.828 0-4.243.879-5.121C7.757 5 9.172 5 12 5h3c2.828 0 4.243 0 5.121.879C21 6.757 21 8.172 21 11v5c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22h-3c-2.828 0-4.243 0-5.121-.879C6 20.243 6 18.828 6 16v-5z"
                ></path>
                <path
                  stroke="white"
                  strokeWidth="1.5"
                  d="M6 19a3 3 0 01-3-3v-6c0-3.771 0-5.657 1.172-6.828C5.343 2 7.229 2 11 2h4a3 3 0 013 3"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <p className="text-center">دانلود فایل کد ملی به صورت اکسل EXCEL</p>
        <label htmlFor="cityPicker">
          انتخاب شهر
        </label>
        <select id='cityPicker' className="block w-full bg-blue-950 text-gray-100 border-2 rounded p-2 focus:outline-none" 
        onChange={(e)=>{
          setSelectedCity(e.target.value)
        }}>
              {

                Object.entries(cityCode).map((item,index)=>
                
                  <option value={item[0]} key={index}>
                    {
                      `${item[1][0]} - ${item[1][1]}`
                    }
                  </option>
                
                )
              }
        </select>
        <label htmlFor="onlySelectedCity" className="flex items-center gap-2">
        <input id="onlySelectedCity" type="checkbox" value={onlySelectedCity}  onChange={(e)=>{
          setOnlySelectedCity(e.target.value === "false" ? true : false)
        }}/>
          لیست کد ملی ها فقط از شهر انتخابی باشد
        </label>
        <label
          className="block tracking-wide text-gray-100 font-bold sm:text-left text-center"
          htmlFor="nationaIdCount"
        >
          لطفا تعداد کد ملی مد نظر را انتخاب کنید
        </label>
        <input
          type="number"
          min="1"
          max="1000"
          id="nationaIdCount"
          onChange={(e) => {
            let number = 1;
            if (Number(e.target.value) > 1000) {
              number = 1000;
            } else if (Number(e.target.value) < 1) {
              number = "";
            } else {
              number = e.target.value;
            }
            setNationalIdCount(number);
          }}
          value={nationalIdCount}
          className="block w-full bg-blue-950 text-gray-100 border-2 rounded p-2 focus:outline-none "
        />
        <p>* محدودیت تعداد کد ملی تا 1000 عدد است</p>
        <button
          type="buttom"
          className="border-2 p-2 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            setIsDownloading(true);
            const generatedNationalId = [];
            for (let i = 0; i < Number(nationalIdCount); i++) {
              const nationalCodeObject = nationalIdGenerator();
              generatedNationalId.push(nationalCodeObject);
            }
            let data = [
              {
                sheet: "کد ملی ",
                columns: [
                  { label: "کد ملی", value: "nationalId" },
                  { label: "استان", value: "province" },
                  { label: "شهر", value: "city" },
                ],
                content: [...generatedNationalId],
              },
            ];
            xlsx(data, settings, () => {
              setIsDownloading(false);
            });
          }}
        >
          {isDownloading ? "در حال آماده سازی و دانلود" : "دانلود فایل"}
        </button>
      </div>
    </div>
  );
}

export default App;
