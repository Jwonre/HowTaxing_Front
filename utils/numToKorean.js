const numberToKorean = num => {
  const korean = num?.toString().split('').reverse().join('');
  const units = ['','만', '억', '조', '경', '해'];
  const koreanArray = korean === undefined  ? ['0'] : korean.match(/.{1,4}/g);
  const koreanNumberArray = koreanArray.map((item, index) => {
    if (index < units.length) {
      if(Number(item) === 0) {
        item = ''; 
      } else {
        while (item.endsWith('0')) {
          item = item.slice(0, -1); // 문자열에서 우측의 '0'을 제거
        }
        item = units[index] + item;
      }
    }
    return item;
  });
  

  // koreanNumberStringArray를 다시 합쳐준다.
  const koreanNumberString = koreanNumberArray.join('').split('').reverse().join('');
  return koreanNumberString;
};

export default numberToKorean;
