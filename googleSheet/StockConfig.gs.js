// ==================== StockConfig.gs ====================
/**
 * 주식 관련 설정값들을 관리하는 모듈
 */
var StockConfig = {
  
  /**
   * 컬럼 설정 정보
   */
  getColumnSettings: function() {
    return {
      evaluationPriceColumn: '평가기준가',
      currentPriceColumn: 'A종가',
      stockNameColumn: '종목'  // 선택적 컬럼
    };
  },
  
  /**
   * 업데이트 규칙 설정
   */
  getUpdateRules: function() {
    return {
      minimumDifference: 0,  // 최소 차이 금액 (0 = 제한 없음)
      allowZeroPrice: false,  // 0원 가격 허용 여부
      logUpdates: true       // 업데이트 로깅 여부
    };
  },
  
  /**
   * 앱 기본 설정
   */
  getAppSettings: function() {
    return {
      appName: '주식 평가기준가 업데이트',
      version: '2.0.0',
      menuName: '주식 관리'
    };
  }
};
