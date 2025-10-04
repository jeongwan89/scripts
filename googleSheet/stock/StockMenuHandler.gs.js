// ==================== StockMenuHandler.gs ====================
/**
 * 스프레드시트 메뉴 관리를 담당하는 모듈
 */
var StockMenuHandler = {
  
  /**
   * 주식 관리 메뉴 생성
   */
  createStockMenu: function() {
    var ui = SpreadsheetApp.getUi();
    var config = StockConfig.getAppSettings();
    
    ui.createMenu(config.menuName)
      .addItem('📈 평가기준가 업데이트', 'executeUpdateEvaluationPrice')
      .addSeparator()
      .addItem('ℹ️ 도움말', 'showHelp')
      .addItem('⚙️ 정보', 'showAppInfo')
      .addToUi();
  }
};

