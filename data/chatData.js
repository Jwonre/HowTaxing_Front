import React from 'react';

// Icons
import BuildingIcon1 from '../assets/icons/house/building_type1_ico.svg';
import BuildingIcon2 from '../assets/icons/house/building_type2_ico.svg';
import HouseIcon from '../assets/icons/house/house.svg';
import VillaIcon from '../assets/icons/house/villa.svg';
import KBICon from '../assets/icons/cert/kb_bank.svg';
import NaverIcon from '../assets/icons/cert/naver_ico.svg';
import TossIcon from '../assets/icons/cert/toss_ico.svg';
import PaycoICon from '../assets/icons/cert/payco_ico.svg';
import SamsungICon from '../assets/icons/cert/samsung_ico.svg';
import PASSICon from '../assets/icons/cert/pass_ico.svg';
import KakaoICon from '../assets/icons/cert/kakao_ico.svg';


export const acquisitionTax = [
  {
    id: 'type',
    // 시스템 메시지(질문)
    type: 'system',
    message: '취득하실 주택 종류는 무엇인가요?',
    // 진행 상태

    progress: 0,
    // 선택지
    select: [
      {
        id: 'apartment',
        name: '아파트',
        icon: <BuildingIcon1 />,
        // 선택시 추가 될 챗 아이템
        //select: ['apartment'],
        openSheet: 'searchHouse'
      },
      {
        id: 'house',
        name: '단독주택 · 다가구',
        icon: <HouseIcon />,
        // 선택 시 오픈할 bottom sheet
        openSheet: 'searchHouse',
      },
      {
        id: 'villa',
        name: '연립 · 다세대',
        icon: <VillaIcon />,
        openSheet: 'searchHouse',
      },
      {
        id: 'ticket',
        name: '입주권',
        icon: <BuildingIcon2 />,
        select: ['ticket'],
      },
    ],
  },
  {
    id: 'area',
    type: 'system',
    message: '전용면적을 제대로 불러오지 못했어요.\n전용면적이 85㎡을 초과하나요?',
    progress: 1,
    select: [
      {
        id: 'yes',
        name: '네',
        select: ['apartmentAddressInfoSystem'],
      },
      {
        id: 'no',
        name: '아니오',
        select: ['apartmentAddressInfoSystem'],
      },
    ]
  },
  {
    id: 'apartmentAddressInfoSystem',
    type: 'system',
    message: '취득하실 주택 정보를 불러왔어요.',
    questionId: 'apartment',
    progress: 2,
  },
  {
    id: 'apartment',
    type: 'system',
    message:
      '분양권 상태에서 최초 취득하신 아파트는 세금 계산 방식이 달라요.\n혹시 아파트를 분양권 상태에서 취득하실 예정인가요?',
    progress: 1,
    select: [
      {
        id: 'yes',
        name: '네',
        openSheet: 'searchHouse',
      },
      {
        id: 'no',
        name: '아니오',
        openSheet: 'searchHouse',
      },
    ],
  },

  {
    id: 'ticket',
    type: 'system',
    message:
      '취득하실 주택이 멸실되었는지에 따라 입주권의 세금 계산 방식이 달라져요. 혹시 이미 멸실된 입주권을 취득하실 예정인가요?',
    progress: 1,
    select: [
      {
        id: 'ticketyes',
        name: '네',
        select: ['destruction'],
      },
      {
        id: 'ticketno',
        name: '아니오',
        openSheet: 'searchHouse',
      },
    ],
  },
  {
    id: 'destruction',
    type: 'system',
    message:
      '멸실된 입주권을 취득하실 예정이라면\n전문 세무사에게 상담을 문의해보세요.\n어떤 복잡한 상황에도\n최선의 결과를 알려주실 거에요.',
    progress: 10,
  },
  {
    id: 'ownHouse',
    type: 'system',
    message: '보유 주택 수를 어떻게 가져올까요?',
    progress: 4,
    select: [
      {
        id: 'no',
        name: '본인 인증하기',
        select: ['certType'],
      },
      {
        id: 'yes',
        name: '직접 입력하기',
        openSheet: 'ownHouseCount',

      },
    ],
  },
  {
    id: 'certType',
    type: 'system',
    progress: 5,
    message: '공공기관에서 여러 인증방식을 제공해요. 인증방식을 선택해주세요.\n청약통장이 없다면 인증이 어려우므로 보유 중인 주택들을 직접 등록해주세요.',
    select: [
      {
        id: 'KB',
        name: 'KB 간편인증',
        icon: <KBICon />,
      },
      {
        id: 'naver',
        name: '네이버 간편인증',
        icon: <NaverIcon />,
      },
      {
        id: 'toss',
        name: '토스 인증',
        icon: <TossIcon />,
      },
      {
        id: 'Nosubscriptionaccount',
        name: '청약통장 미보유',
        select: ['moment2'],
        prevchat: 'AcquisitionChat'
      },
    ],
  },
  {
    id: 'moreHouse',
    type: 'system',
    message: '취득하실 주택 외 보유 중인 주택이 있나요?',
    progress: 3,
    select: [
      {
        id: 'yes',
        name: '네',
        select: ['OwnHouseInfo', 'ownHouse'],
      },
      {
        id: 'no',
        name: '아니오',
        select: ['getInfoDone', 'getInfoConfirm'],
      },
    ],
  },
  {
    id: 'OwnHouseInfo',
    type: 'system',
    message:
      '취득하실 주택의 취득세를 계산하기\n위해 보유 주택 수가 필요해요.\n공공기관에서 불러오거나\n직접 입력할 수 있어요.',
    progress: 3,
  },
  {
    id: 'aquiAmountSystem',
    type: 'system',
    message: '취득금액을 입력해주세요.',
    questionId: 'apartment',
    progress: 4,
  },
  {
    id: 'allHouse1',
    type: 'system',
    message: '보유 중인 주택을 모두 불러왔어요.',
    progress: 5,
    select: [
      {
        id: 'ok',
        name: '보유 주택 확인하기',
        chungYackYn: false,
        openSheet: 'own',
      },
    ],
  },
  {
    id: 'allHouse2',
    type: 'system',
    message: '보유 중인 주택을 모두 불러왔어요.',
    progress: 5,
    select: [
      {
        id: 'ok',
        name: '보유 주택 확인하기',
        chungYackYn: true,
        openSheet: 'own',
      },
    ],
  },
  {
    id: 'joint',
    type: 'system',
    message: '혹시 공동 소유 예정인가요?',
    questionId: 'apartment',
    progress: 3,
    select: [
      {
        id: 'only',
        type: 'my',
        name: '단독 소유',
        select: ['moreHouse'],
      },
      {
        id: 'joint',
        type: 'my',
        name: '공동 소유',
        openSheet: 'joint',
      },
    ],
  },
  {
    id: 'moment1',
    type: 'system',
    message:
      '잠깐!\n불러온 주택 중 입주권이 있다면 입주권이라고 반드시 알려주셔야 해요.',
    progress: 5,
    select: [
      {
        id: 'ok',
        name: '확인하기',
        select: ['allHouse1'],
      },
    ],
    questionId: 'moment',
  },
  {
    id: 'moment2',
    type: 'system',
    message:
      '잠깐!\n불러온 주택 중 입주권이 있다면 입주권이라고 반드시 알려주셔야 해요.',
    progress: 5,
    select: [
      {
        id: 'ok',
        name: '확인하기',
        select: ['allHouse2'],
      },
    ],
    questionId: 'moment',
  },
  {
    id: 'getInfoDone',
    type: 'system',
    message: '취득세 계산에 필요한 정보들을 모두 수집했어요.',
    progress: 6,
  },
  {
    id: 'getInfoConfirm',
    type: 'system',
    progress: 7,
    message:
      '잘못된 정보들로 취득세를 계산하면 정확한 결과가 나오지 않을 수 있어요. 모든 정보들이 맞는지 확인해볼까요?',
  },
  {
    id: 'calulating',
    type: 'system',
    message:
      '계산하는 중이에요.\n서비스를 종료하지 마시고, 조금만 기다려주세요.',
    progress: 8,
  },
  {
    id: 'cta',
    type: 'system',
    progress: 9,
  },
  {
    id: 'goodbye',
    type: 'system',
    message:
      '취득세 계산 결과는 마음에 드셨나요?\n곧 소유권 이전 등기까지 한 번에 가능하도록 서비스를 개발하고 있어요.\n앞으로도 많은 사랑과 관심 부탁드려요.',
    progress: 10,
    openSheet: 'review',
  },
  {
    id: 'additionalQuestion',
    type: 'system',
    message: '',
    progress: 6,
    select: [
      {
        id: 'additionalQuestionY',
        name: '',
        // select: ['getInfoDone', 'getInfoConfirm'],
        select: [],
        answer: '',
      },
      {
        id: 'additionalQuestionN',
        name: '',
        // select: ['getInfoDone', 'getInfoConfirm'],
        select: [],
        answer: '',
      },
    ],
    questionId: '',

  },
];

export const gainTax = [
  {
    id: 'hello',
    type: 'system',
    message:
      '안녕하세요!\n지금부터 양도소득세를 쉽고 정확하게\n계산해드릴 거에요.\n저만 믿고 끝까지 잘 따라와 주세요!',
    progress: 0,
  },
  {
    id: 'type',
    user: 'system',
    message: '혹시 주택임대사업자로\n등록하셨나요?',
    progress: 1,
    select: [
      {
        id: 'yes',
        name: '네',
        select: ['cta'],
      },
      {
        id: 'no',
        name: '아니오',
        select: ['certInfo', 'cert'],
      },
    ],
  },

  {
    id: 'cta',
    type: 'system',
    progress: 10,
    message:
      '주택 임대 사업자에 해당되시면\n전문 세무사에게 상담을 문의해보세요.\n어떤 복잡한 상황에도\n최선의 결과를 알려주실 거에요.',
  },

  {
    id: 'getInfoDone',
    type: 'system',
    progress: 6,
    message: '양도소득세 계산에 필요한 정보들을 모두 수집했어요.',
  },
  {
    id: 'allHouse1',
    type: 'system',
    message: '보유 중인 주택을 모두 불러왔어요.',
    progress: 3,
    select: [
      {
        id: 'ok',
        name: '보유 주택 확인하기',
        chungYackYn: false,
        openSheet: 'own2',
      },
    ],
  },
  {
    id: 'allHouse2',
    type: 'system',
    message: '보유 중인 주택을 모두 불러왔어요.',
    progress: 3,
    select: [
      {
        id: 'ok',
        name: '보유 주택 확인하기',
        chungYackYn: true,
        openSheet: 'own2',
      },
    ],
  },
  {
    id: 'getInfoConfirm',
    type: 'system',
    progress: 7,
    message:
      '잘못된 정보들로 양도소득세를 계산하면 정확한 결과가 나오지 않을 수 있어요. 모든 정보들이 맞는지 확인해볼까요?',
  },
  {
    id: 'cert',
    type: 'system',
    message: '보유 주택을 어떻게 가져올까요?',
    progress: 2,
    select: [
      {
        id: 'yes',
        name: '본인 인증하기',
        select: ['certType'],


      },
      {
        id: 'no',
        name: '직접 입력하기',
      },
    ],
  },
  {
    id: 'certInfo',
    type: 'system',
    progress: 2,
    message:
      '양도하실 주택의 양도소득세를\n계산하려면 보유 주택들이 필요해요.\n공공기관에서 불러오거나\n직접 입력할 수도 있어요.',
  },
  {
    id: 'certType',
    type: 'system',
    progress: 3,
    message: '공공기관에서 여러 인증방식을 제공해요. 인증방식을 선택해주세요.\n청약통장이 없다면 인증이 어려우므로 보유 중인 주택들을 직접 등록해주세요.',
    select: [
      {
        id: 'KB',
        name: 'KB 간편인증',
        icon: <KBICon />,
      },
      {
        id: 'naver',
        name: '네이버 간편인증',
        icon: <NaverIcon />,
      },
      {
        id: 'toss',
        name: '토스 인증',
        icon: <TossIcon />,
      },
      {
        id: 'Nosubscriptionaccount',
        name: '청약통장 미보유',
        select: ['allHouse2'],
      },
    ],
  },
  {
    id: 'certType12',
    type: 'system',
    progress: 3,
    message: '공공기관에서 여러 인증방식을 제공해요. 인증방식을 선택해주세요.\n청약통장이 없다면 인증이 어려우므로 보유 중인 주택들을 직접 등록해주세요.',
    select: [
      {
        id: 'KB',
        name: 'KB 간편인증',
        icon: <KBICon />,
      },
      {
        id: 'naver',
        name: '네이버 간편인증',
        icon: <NaverIcon />,
      },
      {
        id: 'toss',
        name: '토스 인증',
        icon: <TossIcon />,
      },
    ],
  },
  {
    id: 'certType2',
    type: 'system',
    progress: 3,
    message: '공공기관에서 여러 인증방식을 제공해요. 인증방식을 선택해주세요.',
    select: [
      {
        id: 'PASS',
        name: 'PASS 간편인증',
        icon: <PASSICon />,
        openSheet: 'cert2',
        prevchat: 'GainsTaxChat'
      },
      {
        id: 'KAKAO',
        name: '카카오톡 간편인증',
        icon: <KakaoICon />,
        openSheet: 'cert2',
        prevchat: 'GainsTaxChat'
      },
      {
        id: 'PAYCO',
        name: '페이코 간편인증',
        icon: <PaycoICon />,
        openSheet: 'cert2',
        prevchat: 'GainsTaxChat'
      },
      {
        id: 'SAMSUNG',
        name: '삼성 패스 인증',
        icon: <SamsungICon />,
        openSheet: 'cert2',
        prevchat: 'GainsTaxChat'
      },
      {
        id: 'KB',
        name: 'KB 간편인증',
        icon: <KBICon />,
        openSheet: 'cert2',
        prevchat: 'GainsTaxChat'
      },
    ],
  },
  {
    id: 'real',
    type: 'system',
    progress: 8,
    message: '실거주기간을 불러왔어요.',
  },
  {
    id: 'year',
    type: 'my',
    progress: 8,
    message: '2년 10개월',
  },
  {
    id: 'ExpenseInquiry',
    type: 'system',
    message: '지금 양도하려는 이 주택을 취득할 때 소요된 필요 경비에 따라 양도소득세가 달라질 수 있어요.',
    progress: 5,
  },
  {
    id: 'ExpenseAnswer',
    type: 'system',
    message: '필요경비를 입력해주세요.',
    progress: 5,
    select: [
      {
        id: 'ExpenseAmount',
        name: '필요경비 입력하기',
        openSheet: 'Expense',
        currentPageIndex: 0,
      },
    ],
  },
  {
    id: 'goodbye',
    type: 'system',
    progress: 10,
    message:
      '양도소득세 계산 결과는 마음에 드셨나요?\n곧 대리 신고까지 한 번에 가능하도록 서비스를 개발하고 있어요.\n앞으로도 많은 사랑과 관심 부탁드려요.',
  },
  {
    id: 'over12',
    type: 'system',
    progress: 5,
    message:
      '양도하실 주택의 양도금액이 12억을 초과하는군요. 정확한 양도소득세 계산을 위해서 실거주 기간이 추가로 필요해요. 지금 본인인증을 한 번 더 해야해요.',
  },
  {
    id: 'under12',
    type: 'system',
    progress: 5,
    message:
      '정확한 양도소득세 계산을 위해서 실거주 기간이 추가로 필요해요. 지금 본인인증을 한 번 더 해야해요.',
  },

  {
    id: 'Acquiredhouse',
    type: 'system',
    progress: 4,
    message:
      '최근 취득한 주택에 1년 이상\n거주하실 예정인가요?',
    select: [
      {
        id: 'AcquiredhouseY',
        name: '네',
        select: ['over12', 'residenceperiod2'],

      },
      {
        id: 'AcquiredhouseN',
        name: '아니오',
        select: ['over12', 'residenceperiod2'],
      },
    ],
  },
  {
    id: 'Acquiredhouse2',
    type: 'system',
    progress: 4,
    message:
      '최근 취득한 주택에 1년 이상\n거주하실 예정인가요?',
    select: [
      {
        id: 'AcquiredhouseY',
        name: '네',
        select: ['under12', 'residenceperiod2'],

      },
      {
        id: 'AcquiredhouseN',
        name: '아니오',
        select: ['under12', 'residenceperiod2'],
      },
    ],
  },
  {
    id: 'residenceperiod',
    type: 'system',
    progress: 5,
    message: '',
    questionId: '',
    select: [
  /*    {
        id: 'cert2',
        name: '본인 인증하기',
        select: ['certType2'],
        answer: '02'
      },*/
      {
        id: 'directlivePeriod',
        name: '직접 입력하기',
        openSheet: 'directlivePeriod',
        answer: '01'

      },
    ],

  },
  {
    id: 'residenceperiod2',
    type: 'system',
    progress: 5,
    message: '실거주 기간을 어떻게 가져올까요?',
    select: [
 /*      {
        id: 'cert2',
        name: '본인 인증하기',
        select: ['certType2'],
        answer: '02'
      },*/
      {
        id: 'directlivePeriod',
        name: '직접 입력하기',
        openSheet: 'directlivePeriod',
        answer: '01'

      },
    ],

  },
  /*{
    id: 'landlord1',
    type: 'system',
    message: '상생임대인에 해당하시나요?',
    progress: 3,
    select: [
      {
        id: 'landlordY',
        name: '네',
        select: ['Acquiredhouse2'],
        key: 'landlord',
      },
      {
        id: 'landlordN',
        name: '아니오',
        select: ['Acquiredhouse2'],
        key: 'landlord',
      },
    ],
  },*/
  {
    id: 'landlord2',
    type: 'system',
    message: '상생임대인에 해당하시나요?',
    progress: 3,
    questionId: 'Q_0006',
    select: [
      {
        id: 'landlordY',
        name: '네',
        select: ['ExpenseInquiry', 'ExpenseAnswer'],
        answer: '01'
      },
      {
        id: 'landlordN',
        name: '아니오',
        select: ['ExpenseInquiry', 'ExpenseAnswer'],
        answer: '02'
      },
    ],
  },

  {
    id: 'additionalQuestion2',
    type: 'system',
    message: '',
    progress: 3,
    questionId: '',
    answer: '',
  },

  {
    id: 'additionalQuestion',
    type: 'system',
    message: '',
    progress: 3,
    select: [
      {
        id: 'additionalQuestionY',
        name: '',
        //select: ['ExpenseInquiry', 'ExpenseAnswer'],
        select: [],
        answer: '',
      },
      {
        id: 'additionalQuestionN',
        name: '',
        // select: ['ExpenseInquiry', 'ExpenseAnswer'],
        select: [],
        answer: '',
      },
    ],
    questionId: '',

  },


];

