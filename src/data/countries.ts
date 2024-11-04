export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const countries: Country[] = [
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "Afghanistan", code: "AF", dialCode: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "AL", dialCode: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "DZ", dialCode: "+213", flag: "🇩🇿" },
  { name: "Andorra", code: "AD", dialCode: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "AO", dialCode: "+244", flag: "🇦🇴" },
  { name: "Argentina", code: "AR", dialCode: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "AM", dialCode: "+374", flag: "🇦🇲" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "AT", dialCode: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "AZ", dialCode: "+994", flag: "🇦🇿" },
  { name: "Bahrain", code: "BH", dialCode: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "BD", dialCode: "+880", flag: "🇧🇩" },
  { name: "Belarus", code: "BY", dialCode: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "BE", dialCode: "+32", flag: "🇧🇪" },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "ID", dialCode: "+62", flag: "🇮🇩" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", flag: "🇳🇿" },
  { name: "Russia", code: "RU", dialCode: "+7", flag: "🇷🇺" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Sweden", code: "SE", dialCode: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", dialCode: "+41", flag: "🇨🇭" },
  { name: "Thailand", code: "TH", dialCode: "+66", flag: "🇹🇭" },
  { name: "Turkey", code: "TR", dialCode: "+90", flag: "🇹🇷" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Vietnam", code: "VN", dialCode: "+84", flag: "🇻🇳" }
];