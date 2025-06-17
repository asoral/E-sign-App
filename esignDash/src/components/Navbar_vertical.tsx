

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { clearUser } from '../redux/reducers/userReducerSlice';
import { selectFullName, selectEmail } from '../redux/selectors/userSelector';
import { useState } from 'react';

type Language = 'en' | 'jp';

interface Translation {
  profile: string;
  dashboard: string;
  inbox: string;
  sent: string;
  documents: string;
  template: string;
  signature: string;
  openssl:string;
  logout: string;
}

interface Translations {
  en: Translation; // English
  jp: Translation; // Japanese
  es: Translation; // Spanish
  de: Translation; // German
  fr: Translation; // French
  zh: Translation; // Chinese (Simplified)
  it: Translation; // Italian
  pt: Translation; // Portuguese
  ru: Translation; // Russian
  ar: Translation; // Arabic
  ko: Translation; // Korean
}
function Navbar_vertical() {
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const [language, setLanguage] = useState<Language>('en');

 const translations: Translations = {
  en: {
    profile: "View profile",
    dashboard: "Dashboard",
    inbox: "Inbox",
    sent: "Sent",
    documents: "Documents",
    template: "Template",
    signature: "Signature",
    openssl: "OpenSSL",
    logout: "Logout"
  },
  jp: {
    profile: "プロフィールを見る",
    dashboard: "ダッシュボード",
    inbox: "受信箱",
    sent: "送信済み",
    documents: "ドキュメント",
    template: "テンプレート",
    signature: "署名",
    openssl: "オープンSSL",
    logout: "ログアウト"
  },
  es: {
    profile: "Ver perfil",
    dashboard: "Tablero",
    inbox: "Bandeja de entrada",
    sent: "Enviado",
    documents: "Documentos",
    template: "Plantilla",
    signature: "Firma",
    openssl: "OpenSSL",
    logout: "Cerrar sesión"
  },
  de: {
    profile: "Profil anzeigen",
    dashboard: "Dashboard",
    inbox: "Posteingang",
    sent: "Gesendet",
    documents: "Dokumente",
    template: "Vorlage",
    signature: "Unterschrift",
    openssl: "OpenSSL",
    logout: "Abmelden"
  },
  fr: {
    profile: "Voir le profil",
    dashboard: "Tableau de bord",
    inbox: "Boîte de réception",
    sent: "Envoyé",
    documents: "Documents",
    template: "Modèle",
    signature: "Signature",
    openssl: "OpenSSL",
    logout: "Se déconnecter"
  },
  zh: {
    profile: "查看资料",
    dashboard: "仪表板",
    inbox: "收件箱",
    sent: "已发送",
    documents: "文件",
    template: "模板",
    signature: "签名",
    openssl: "开放SSL",
    logout: "登出"
  },
  it: {
    profile: "Visualizza profilo",
    dashboard: "Cruscotto",
    inbox: "Posta in arrivo",
    sent: "Inviati",
    documents: "Documenti",
    template: "Modello",
    signature: "Firma",
    openssl: "OpenSSL",
    logout: "Disconnettersi"
  },
  pt: {
    profile: "Ver perfil",
    dashboard: "Painel de controle",
    inbox: "Caixa de entrada",
    sent: "Enviado",
    documents: "Documentos",
    template: "Modelo",
    signature: "Assinatura",
    openssl: "OpenSSL",
    logout: "Sair"
  },
  ru: {
    profile: "Просмотр профиля",
    dashboard: "Панель управления",
    inbox: "Входящие",
    sent: "Отправленные",
    documents: "Документы",
    template: "Шаблон",
    signature: "Подпись",
    openssl: "OpenSSL",
    logout: "Выйти"
  },
  ar: {
    profile: "عرض الملف الشخصي",
    dashboard: "لوحة القيادة",
    inbox: "البريد الوارد",
    sent: "المرسلة",
    documents: "المستندات",
    template: "قالب",
    signature: "توقيع",
    openssl: "أوبن إس إس إل",
    logout: "تسجيل الخروج"
  },
  ko: {
    profile: "프로필 보기",
    dashboard: "대시보드",
    inbox: "받은 편지함",
    sent: "보낸 편지함",
    documents: "문서",
    template: "템플릿",
    signature: "서명",
    openssl: "오픈SSL",
    logout: "로그아웃"
  }
};

const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setLanguage(e.target.value as Language);
};

function logoutUser()
{
  dispatch(clearUser());
  
  navigate("/")
}
const userProfileURL='data:image/png;base64,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' 
const username = useSelector(selectFullName);
const email = useSelector(selectEmail);

  return (
    <>
    <div className="h-full p-3 space-y-5 w-60 dark:bg-gray-200 dark:text-gray-800">
      <div className="flex items-center p- space-x-4">
          <div>
        <Link to="/profile">
          <img src={userProfileURL} alt="" className="w-12 h-12 rounded-full dark:bg-gray-500" />
          <h2 className="text-lg font-semibold">{username}</h2>
          <h3 className="text-xs " style={{ color: '#888', opacity: 0.6 }}>{email}</h3>

            <span className="flex items-center space-x-1">
              <p rel="noopener noreferrer" className="text-xs hover:underline dark:text-gray-600">{translations[language].profile}</p>
            </span>
            </Link>
            <div className="m-0">
          <select value={language} onChange={handleLanguageChange} className="p-0 rounded border text-xs hover:underline dark:text-gray-600">
          <option value="en">English</option>
          <option value="jp">日本語</option> 
          <option value="es">Español</option> 
          <option value="de">Deutsch</option> 
          <option value="fr">Français</option>  
          <option value="zh">简体中文</option> 
          <option value="it">Italiano</option> 
          <option value="pt">Português</option> 
          <option value="ru">Русский</option> 
          <option value="ar">العربية</option>
          <option value="ko">한국어</option>
          </select>
        </div>
          </div>
    
      </div>
      <div className="divide-y dark:divide-gray-300">
        <ul className="pt-2 pb-4 space-y-1 text-sm">  
        <li className="hover:bg-[#283C42] hover:text-white hover:border-white transition-colors duration-300">
          <Link to="/dashboard">
            <p rel="noopener noreferrer"  className="flex items-center p-2 space-x-3 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current dark:text-[#7E869E]">
                <path d="M68.983,382.642l171.35,98.928a32.082,32.082,0,0,0,32,0l171.352-98.929a32.093,32.093,0,0,0,16-27.713V157.071a32.092,32.092,0,0,0-16-27.713L272.334,30.429a32.086,32.086,0,0,0-32,0L68.983,129.358a32.09,32.09,0,0,0-16,27.713V354.929A32.09,32.09,0,0,0,68.983,382.642ZM272.333,67.38l155.351,89.691V334.449L272.333,246.642ZM256.282,274.327l157.155,88.828-157.1,90.7L99.179,363.125ZM84.983,157.071,240.333,67.38v179.2L84.983,334.39Z"></path>
              </svg>
              <span>{translations[language].dashboard}</span>
            </p>
          </Link>
        </li>
        <li className="hover:bg-[#283C42] hover:text-white hover:border-white transition-colors duration-300">
          <Link to="/inbox">
            <p rel="noopener noreferrer"  className="flex items-center p-2 space-x-3 rounded-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="6" width="16" height="12" rx="2" stroke="#7E869E" strokeWidth="1.2" />
                <path d="M4 9L11.1056 12.5528C11.6686 12.8343 12.3314 12.8343 12.8944 12.5528L20 9" stroke="#7E869E" strokeWidth="1.2" />
                <path d="M11.3739 12.0161L5.29325 8.9758C4.86838 8.76337 4.6 8.32912 4.6 7.8541C4.6 7.16148 5.16148 6.6 5.8541 6.6H18.1459C18.8385 6.6 19.4 7.16148 19.4 7.8541C19.4 8.32912 19.1316 8.76337 18.7067 8.9758L12.6261 12.0161C12.232 12.2132 11.768 12.2132 11.3739 12.0161Z" fill="#7E869E" fillOpacity="0.25" strokeWidth="1.2" />
              </svg>
              <span>{translations[language].inbox}</span>
            </p>
          </Link>
        </li>
        <li className="hover:bg-[#283C42] hover:text-white hover:border-white transition-colors duration-300">
          <Link to="/sent">
            <p rel="noopener noreferrer"  className="flex items-center p-2 space-x-3 rounded-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M18.2103 5.19087C17.7865 5.26625 17.2074 5.45789 16.3634 5.73923L9.87243 7.90289C9.05037 8.17692 8.45221 8.37646 8.01774 8.54598C7.56629 8.72212 7.36821 8.8387 7.28525 8.91842C6.67103 9.50865 6.67103 10.4913 7.28525 11.0815C7.36821 11.1613 7.56629 11.2778 8.01774 11.454C8.45221 11.6235 9.05037 11.823 9.87243 12.0971C9.88549 12.1014 9.89838 12.1057 9.9111 12.11C10.2031 12.2072 10.4046 12.2743 10.5877 12.3711C11.0314 12.6058 11.3942 12.9686 11.6289 13.4124C11.7257 13.5954 11.7928 13.7969 11.8901 14.0889C11.8943 14.1016 11.8986 14.1145 11.9029 14.1276C12.177 14.9496 12.3765 15.5478 12.546 15.9823C12.7222 16.4337 12.8387 16.6318 12.9185 16.7148C13.5087 17.329 14.4914 17.329 15.0816 16.7148C15.1613 16.6318 15.2779 16.4337 15.454 15.9823C15.6235 15.5478 15.8231 14.9496 16.0971 14.1276L18.2608 7.6366C18.5421 6.79257 18.7338 6.21349 18.8091 5.78975C18.8852 5.36239 18.8102 5.2653 18.7724 5.22757C18.7347 5.18983 18.6376 5.11485 18.2103 5.19087ZM18.0351 4.20633C18.5449 4.11564 19.0803 4.12118 19.4796 4.52046C19.8788 4.91974 19.8844 5.45511 19.7937 5.96489C19.7039 6.46966 19.4875 7.11879 19.2231 7.91194L19.2095 7.95283L17.0458 14.4438L17.0409 14.4586C16.7728 15.2629 16.5654 15.885 16.3856 16.3458C16.2114 16.7924 16.0355 17.1653 15.8026 17.4076C14.8189 18.4314 13.1812 18.4314 12.1974 17.4076C11.9645 17.1653 11.7887 16.7924 11.6144 16.3457C11.4347 15.885 11.2273 15.2629 10.9592 14.4587L10.9543 14.4438C10.8392 14.0987 10.7982 13.9807 10.7449 13.8799C10.6041 13.6136 10.3864 13.3959 10.1201 13.2551C10.0193 13.2018 9.90135 13.1608 9.5562 13.0458L9.54131 13.0408C8.73712 12.7727 8.11501 12.5654 7.65426 12.3856C7.20765 12.2113 6.83471 12.0355 6.59236 11.8026C5.56866 10.8189 5.56866 9.1811 6.59236 8.19737C6.83471 7.96448 7.20765 7.78863 7.65426 7.61438C8.11502 7.4346 8.73715 7.22723 9.54136 6.95916L9.5562 6.95421L16.0472 4.79055L16.088 4.77693C16.8812 4.51252 17.5303 4.29612 18.0351 4.20633Z" fill="#7E869E"/>
              </svg>
              <span>{translations[language].sent}</span>
            </p>
          </Link>
        </li>
        <li className="hover:bg-[#283C42] hover:text-white hover:border-white transition-colors duration-300">
          <Link to="/documents">
            <p rel="noopener noreferrer"  className="flex items-center p-2 space-x-3 rounded-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 18.5004H5.9C5.05992 18.5004 4.63988 18.5004 4.31901 18.3369C4.03677 18.1931 3.8073 17.9636 3.66349 17.6814C3.5 17.3605 3.5 16.9405 3.5 16.1004V6.9C3.5 6.05992 3.5 5.63988 3.66349 5.31901C3.8073 5.03677 4.03677 4.8073 4.31901 4.66349C4.63988 4.5 5.05992 4.5 5.9 4.5H8.47237C8.84808 4.5 9.03594 4.5 9.20646 4.55179C9.35741 4.59763 9.49785 4.6728 9.61972 4.77298C9.75739 4.88614 9.86159 5.04245 10.07 5.35507L10.93 6.64533C11.1384 6.95795 11.2426 7.11426 11.3803 7.22742C11.5022 7.3276 11.6426 7.40277 11.7935 7.44861C11.9641 7.5004 12.1519 7.5004 12.5276 7.5004H16.5004C16.965 7.5004 17.1973 7.5004 17.3879 7.55143C17.9058 7.69008 18.3103 8.09459 18.449 8.61248C18.5 8.80308 18.5 9.03539 18.5 9.5V9.5M9.5 13.5H16.5" stroke="#7E869E" strokeLinecap="round"/>
                <path d="M5.95298 11.1411C6.14969 10.551 6.24804 10.2559 6.43047 10.0378C6.59157 9.84512 6.79845 9.69601 7.03216 9.6041C7.2968 9.50002 7.60783 9.50003 8.2299 9.50005L18.1703 9.50031C19.2945 9.50034 19.8566 9.50036 20.2255 9.7357C20.5485 9.94171 20.7804 10.2635 20.8737 10.635C20.9803 11.0595 20.8025 11.5928 20.447 12.6593L19.047 16.8593C18.8503 17.4495 18.752 17.7445 18.5695 17.9627C18.4084 18.1553 18.2016 18.3044 17.9679 18.3963C17.7032 18.5004 17.3922 18.5004 16.7702 18.5004H6.82977C5.70557 18.5004 5.14347 18.5004 4.77449 18.2651C4.4515 18.0591 4.21958 17.7373 4.12628 17.3657C4.01969 16.9413 4.19744 16.408 4.55293 15.3415L5.95298 11.1411Z" stroke="#7E869E"/>
              </svg>
              <span>{translations[language].documents}</span>
            </p>
          </Link>
        </li>
        <li className="hover:bg-[#283C42] hover:text-white hover:border-white transition-colors duration-300">
          <Link to="/templete">
            <p rel="noopener noreferrer"  className="flex items-center p-2 space-x-3 rounded-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 9H21V18C21 18.9428 21 19.4142 20.7071 19.7071C20.4142 20 19.9428 20 19 20H15V9Z" stroke="#7E869E" strokeWidth="1" strokeLinecap="round"/>
                <path d="M3 9H9V20H5C4.05719 20 3.58579 20 3.29289 19.7071C3 19.4142 3 18.9428 3 18V9Z" stroke="#7E869E" strokeWidth="1" strokeLinecap="round"/>
                <rect x="9" y="9" width="6" height="11" stroke="#7E869E" strokeWidth="1" strokeLinecap="round"/>
                <path d="M3 6C3 5.05719 3 4.58579 3.29289 4.29289C3.58579 4 4.05719 4 5 4H19C19.9428 4 20.4142 4 20.7071 4.29289C21 4.58579 21 5.05719 21 6V9H3V6Z" stroke="#7E869E" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <span>{translations[language].template}</span>
            </p>
          </Link>
        </li>
        </ul>
        <ul className="pt-4 pb-2 space-y-1 text-sm">
        <li className="hover:bg-[#283C42] hover:text-white hover:border-white transition-colors duration-300">
          <Link to="/openssl">
            <p rel="noopener noreferrer"  className="flex items-center p-2 space-x-3 rounded-md">
              <svg
                width="2em"
                height="2em"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M1.961 13.532a2.04 2.04 0 0 1-.818-.157 1.745 1.745 0 0 1-.616-.437 1.967 1.967 0 0 1-.389-.664A2.441 2.441 0 0 1 0 11.442c0-.299.046-.576.137-.832.091-.256.221-.477.389-.664a1.76 1.76 0 0 1 .617-.438c.243-.105.516-.157.818-.157.303 0 .575.052.818.157.243.105.448.25.616.437.168.187.298.408.389.664.091.256.137.533.137.832 0 .299-.046.576-.137.832a1.983 1.983 0 0 1-.389.664 1.741 1.741 0 0 1-.616.437 2.04 2.04 0 0 1-.818.158zm0-.443c.235 0 .443-.042.622-.126s.331-.199.454-.345c.123-.146.216-.319.277-.521.062-.202.092-.42.092-.656 0-.235-.031-.454-.092-.656a1.493 1.493 0 0 0-.277-.524c-.123-.148-.275-.263-.454-.347s-.386-.125-.622-.125c-.235 0-.443.042-.622.126a1.31 1.31 0 0 0-.454.347 1.477 1.477 0 0 0-.277.524c-.062.202-.092.42-.092.656 0 .235.031.454.092.656.062.202.154.375.277.521.123.146.275.261.454.345.18.083.387.125.622.125zm2.494-2.538h.454v.409h.011c.108-.149.237-.266.387-.35.149-.084.331-.126.544-.126.183 0 .351.035.504.104.153.069.284.168.392.297.108.129.193.289.255.479.062.191.092.405.092.644 0 .232-.029.442-.087.63a1.41 1.41 0 0 1-.249.482 1.075 1.075 0 0 1-.398.305 1.266 1.266 0 0 1-.527.106c-.198 0-.37-.032-.516-.095a1.018 1.018 0 0 1-.398-.331h-.01v1.557h-.454v-4.111zm1.345 2.6a.737.737 0 0 0 .625-.325c.069-.101.12-.22.154-.359.034-.138.05-.289.05-.454a1.96 1.96 0 0 0-.05-.451 1.123 1.123 0 0 0-.154-.364.751.751 0 0 0-.258-.241.723.723 0 0 0-.361-.087.896.896 0 0 0-.412.09.787.787 0 0 0-.289.247 1.117 1.117 0 0 0-.168.364 1.902 1.902 0 0 0-.006.886c.034.138.087.259.16.361a.779.779 0 0 0 .283.244.932.932 0 0 0 .426.089zm3.037.375a1.4 1.4 0 0 1-.591-.12c-.174-.08-.32-.19-.44-.328s-.211-.3-.275-.485a1.795 1.795 0 0 1-.095-.591c0-.209.033-.406.098-.591.065-.185.159-.346.28-.485a1.287 1.287 0 0 1 .994-.448c.217 0 .408.04.574.12.166.08.305.192.417.336.112.144.197.316.255.516.058.2.087.419.087.658h-2.24c.007.146.034.282.078.409.045.127.106.237.185.331a.835.835 0 0 0 .673.297.855.855 0 0 0 .521-.148.775.775 0 0 0 .28-.445h.443c-.067.314-.209.555-.426.723-.217.167-.49.251-.818.251zm-.028-2.689a.871.871 0 0 0-.359.07.755.755 0 0 0-.266.196 1.045 1.045 0 0 0-.179.297 1.327 1.327 0 0 0-.092.367h1.743c-.015-.291-.094-.519-.238-.684-.145-.164-.348-.246-.609-.246zm2.311.095h.011c.105-.138.231-.247.378-.328.148-.08.328-.12.541-.12.303 0 .541.079.714.238.174.159.261.389.261.692v2.034h-.454v-1.995c0-.191-.058-.336-.174-.437-.116-.101-.276-.151-.482-.151a.846.846 0 0 0-.319.059.755.755 0 0 0-.252.163.708.708 0 0 0-.165.252.886.886 0 0 0-.059.328v1.782h-.454v-2.897h.454v.38zm4.289 2.598c-.549 0-.972-.116-1.271-.347-.299-.231-.456-.561-.47-.989h.8c.03.244.116.418.259.521.143.103.359.155.648.155.105 0 .205-.009.299-.028a.817.817 0 0 0 .248-.09.502.502 0 0 0 .172-.161.43.43 0 0 0 .065-.24.403.403 0 0 0-.07-.242.555.555 0 0 0-.2-.161 1.632 1.632 0 0 0-.313-.113c-.122-.032-.26-.065-.414-.099a7.452 7.452 0 0 1-.521-.138 1.582 1.582 0 0 1-.44-.206.989.989 0 0 1-.304-.332 1.037 1.037 0 0 1-.116-.518c0-.199.038-.374.116-.524.077-.15.184-.276.321-.378.137-.101.3-.178.487-.228.188-.051.394-.076.62-.076.454 0 .82.107 1.096.321.276.214.429.526.459.935h-.783c-.023-.203-.105-.355-.248-.456a.894.894 0 0 0-.53-.152c-.222 0-.398.043-.53.13a.393.393 0 0 0-.197.344c0 .083.018.151.054.206.036.055.09.102.163.144.073.041.164.077.273.107.109.03.238.062.389.096.207.045.401.095.583.149.182.055.342.127.479.217.137.09.245.205.324.344.079.139.118.318.118.535 0 .203-.039.384-.118.544-.079.16-.188.293-.327.4a1.486 1.486 0 0 1-.496.245 2.212 2.212 0 0 1-.625.085zm3.759 0c-.549 0-.972-.116-1.271-.347s-.456-.561-.47-.989h.8c.03.244.116.418.259.521.143.103.359.155.648.155.105 0 .205-.009.299-.028a.817.817 0 0 0 .248-.09.502.502 0 0 0 .172-.161.43.43 0 0 0 .065-.24.403.403 0 0 0-.07-.242.555.555 0 0 0-.2-.161 1.632 1.632 0 0 0-.313-.113c-.122-.032-.26-.065-.414-.099a7.452 7.452 0 0 1-.521-.138 1.582 1.582 0 0 1-.44-.206.989.989 0 0 1-.304-.332 1.037 1.037 0 0 1-.116-.518c0-.199.038-.374.116-.524.077-.15.184-.276.321-.378.137-.101.3-.178.487-.228.188-.051.394-.076.62-.076.454 0 .82.107 1.096.321.276.214.429.526.459.935h-.783c-.023-.203-.105-.355-.248-.456a.894.894 0 0 0-.53-.152c-.222 0-.398.043-.53.13a.393.393 0 0 0-.197.344c0 .083.018.151.054.206.036.055.09.102.163.144.073.041.164.077.273.107.109.03.238.062.389.096.207.045.401.095.583.149.182.055.342.127.479.217.137.09.245.205.324.344.079.139.118.318.118.535 0 .203-.039.384-.118.544-.079.16-.188.293-.327.4a1.486 1.486 0 0 1-.496.245c-.191.056-.4.085-.625.085zm2.122-4.12h.817v3.347H24v.682h-2.71V9.41z" />
              </svg>
              <span>{translations[language].openssl}</span>
            </p>
          </Link>
        </li>
        <li className="hover:bg-[#283C42] hover:text-white hover:border-white transition-colors duration-300">
          <Link to="/signature">
            <p rel="noopener noreferrer"  className="flex items-center p-2 space-x-3 rounded-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.92971 19.283L5.92972 19.283L5.95149 19.2775L5.95151 19.2775L8.58384 18.6194C8.59896 18.6156 8.61396 18.6119 8.62885 18.6082C8.85159 18.5528 9.04877 18.5037 9.2278 18.4023C9.40683 18.301 9.55035 18.1571 9.71248 17.9947C9.72332 17.9838 9.73425 17.9729 9.74527 17.9618L16.9393 10.7678L16.9393 10.7678L16.9626 10.7445C17.2761 10.4311 17.5461 10.1611 17.7333 9.91573C17.9339 9.65281 18.0858 9.36038 18.0858 9C18.0858 8.63961 17.9339 8.34719 17.7333 8.08427C17.5461 7.83894 17.276 7.5689 16.9626 7.2555L16.9393 7.23223L16.5858 7.58579L16.9393 7.23223L16.7678 7.06066L16.7445 7.03738C16.4311 6.72395 16.1611 6.45388 15.9157 6.2667C15.6528 6.0661 15.3604 5.91421 15 5.91421C14.6396 5.91421 14.3472 6.0661 14.0843 6.2667C13.8389 6.45388 13.5689 6.72395 13.2555 7.03739L13.2322 7.06066L6.03816 14.2547C6.02714 14.2658 6.01619 14.2767 6.00533 14.2875C5.84286 14.4496 5.69903 14.5932 5.59766 14.7722C5.4963 14.9512 5.44723 15.1484 5.39179 15.3711C5.38809 15.386 5.38435 15.401 5.38057 15.4162L4.71704 18.0703C4.71483 18.0791 4.7126 18.088 4.71036 18.097C4.67112 18.2537 4.62921 18.421 4.61546 18.5615C4.60032 18.7163 4.60385 18.9773 4.81326 19.1867C5.02267 19.3961 5.28373 19.3997 5.43846 19.3845C5.57899 19.3708 5.74633 19.3289 5.90301 19.2896C5.91195 19.2874 5.92085 19.2852 5.92971 19.283Z" stroke="#7E869E"/>
                <path d="M12.5 7.5L15.5 5.5L18.5 8.5L16.5 11.5L12.5 7.5Z" fill="#7E869E"/>
              </svg>
              <span>{translations[language].signature}</span>
            </p>
          </Link>
        </li>
        <li onClick={logoutUser} className="hover:bg-[#283C42] hover:cursor-pointer hover:text-white hover:border-white transition-colors duration-300">
         
            <p rel="noopener noreferrer"  className="hover:cursor-pointer flex items-center p-2 space-x-3 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current dark:text-[#7E869E]">
                <path d="M440,424V88H352V13.005L88,58.522V424H16v32h86.9L352,490.358V120h56V456h88V424ZM320,453.642,120,426.056V85.478L320,51Z"></path>
                <rect width="32" height="64" x="256" y="232"></rect>
              </svg>
              <span>{translations[language].logout}</span>
            </p>
         
        </li>



        </ul>
      </div>
    </div>
    </>
  )
}

export default Navbar_vertical