// ==================== UIManager.gs ====================
/**
 * 사용자 인터페이스 관련 기능을 담당하는 모듈
 */
var UIManager = {
  
  /**
   * 성공 메시지 표시
   */
  showSuccess: function(message) {
    SpreadsheetApp.getUi().alert('✅ 완료', message, SpreadsheetApp.getUi().ButtonSet.OK);
  },
  
  /**
   * 오류 메시지 표시
   */
  showError: function(message) {
    SpreadsheetApp.getUi().alert('❌ 오류', message, SpreadsheetApp.getUi().ButtonSet.OK);
  },
  
  /**
   * 경고 메시지 표시
   */
  showWarning: function(message) {
    SpreadsheetApp.getUi().alert('⚠️ 주의', message, SpreadsheetApp.getUi().ButtonSet.OK);
  },
  
  /**
   * 업데이트 결과 메시지 생성 및 표시
   */
  showUpdateResult: function(result) {
    if (result.updateCount === 0) {
      this.showWarning(
        '업데이트할 항목이 없습니다.\n\n' +
        '총 ' + result.totalCount + '개 항목을 검사했지만,\n' +
        '모든 평가기준가가 A종가보다 높거나 같습니다.'
      );
    } else {
      var message = result.updateCount + '개 항목의 평가기준가가 업데이트되었습니다.\n\n';
      
      // 업데이트된 종목들 세부 정보 (최대 5개까지만 표시)
      var displayCount = Math.min(result.updatedStocks.length, 5);
      for (var i = 0; i < displayCount; i++) {
        var stock = result.updatedStocks[i];
        message += '• ' + stock.name + ': ' + 
                  this.formatPrice(stock.oldPrice) + ' → ' + 
                  this.formatPrice(stock.newPrice) + 
                  ' (+'+ this.formatPrice(stock.difference) + ')\n';
      }
      
      if (result.updatedStocks.length > 5) {
        message += '... 외 ' + (result.updatedStocks.length - 5) + '개 종목';
      }
      
      this.showSuccess(message);
    }
  },
  
  /**
   * 가격을 포맷된 문자열로 변환
   */
  formatPrice: function(price) {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  }
};
