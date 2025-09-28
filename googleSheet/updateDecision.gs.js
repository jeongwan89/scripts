// ==================== updateDecision.gs ====================
/**
 * 주식 평가기준가 업데이트 핵심 로직을 담당하는 모듈
 */
var StockPriceUpdater = {
  
  /**
   * 평가기준가 업데이트 메인 함수
   */
  updateEvaluationPrice: function() {
    try {
      var sheet = SpreadsheetApp.getActiveSheet();
      var config = StockConfig.getColumnSettings();
      
      // 데이터 범위와 헤더 가져오기
      var dataInfo = this.getSheetData(sheet);
      
      // 필요한 컬럼 인덱스 찾기
      var columnIndexes = this.findRequiredColumns(dataInfo.headers, config);
      
      // 컬럼 유효성 검사
      if (!this.validateRequiredColumns(columnIndexes, config)) {
        return;
      }
      
      // 실제 업데이트 처리
      var updateResult = this.processUpdateLogic(sheet, dataInfo, columnIndexes);
      
      // 결과 메시지 표시
      UIManager.showUpdateResult(updateResult);
      
    } catch (error) {
      UIManager.showError('업데이트 중 오류가 발생했습니다: ' + error.toString());
    }
  },
  
  /**
   * 시트 데이터 정보 가져오기
   */
  getSheetData: function(sheet) {
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    
    if (values.length === 0) {
      throw new Error('시트에 데이터가 없습니다.');
    }
    
    return {
      range: dataRange,
      values: values,
      headers: values[0],
      dataRows: values.slice(1)
    };
  },
  
  /**
   * 필요한 컬럼들의 인덱스 찾기
   */
  findRequiredColumns: function(headers, config) {
    var columnIndexes = {};
    
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].toString().trim();
      
      if (header === config.evaluationPriceColumn) {
        columnIndexes.evaluationPrice = i;
      }
      if (header === config.currentPriceColumn) {
        columnIndexes.currentPrice = i;
      }
      if (header === config.stockNameColumn) {
        columnIndexes.stockName = i;
      }
    }
    
    return columnIndexes;
  },
  
  /**
   * 필수 컬럼 존재 여부 검증
   */
  validateRequiredColumns: function(columnIndexes, config) {
    var missingColumns = [];
    
    if (columnIndexes.evaluationPrice === undefined) {
      missingColumns.push(config.evaluationPriceColumn);
    }
    if (columnIndexes.currentPrice === undefined) {
      missingColumns.push(config.currentPriceColumn);
    }
    
    if (missingColumns.length > 0) {
      UIManager.showError('다음 컬럼을 찾을 수 없습니다: ' + missingColumns.join(', '));
      return false;
    }
    
    return true;
  },
  
  /**
   * 업데이트 로직 처리
   */
  processUpdateLogic: function(sheet, dataInfo, columnIndexes) {
    var updateCount = 0;
    var updatedStocks = [];
    var config = StockConfig.getUpdateRules();
    
    // 각 데이터 행 처리 (헤더 제외)
    for (var row = 0; row < dataInfo.dataRows.length; row++) {
      var rowData = dataInfo.dataRows[row];
      var actualRowNumber = row + 2; // 1(헤더) + 1(0-based index) = 2
      
      // 현재 가격과 평가기준가 추출
      var prices = this.extractPrices(rowData, columnIndexes);
      
      // 업데이트 조건 확인
      if (this.shouldUpdate(prices, config)) {
        // 실제 셀 업데이트
        sheet.getRange(actualRowNumber, columnIndexes.evaluationPrice + 1).setValue(prices.currentPrice);
        
        updateCount++;
        
        // 업데이트된 종목 정보 저장 (로깅용)
        var stockName = columnIndexes.stockName !== undefined 
          ? rowData[columnIndexes.stockName] 
          : '종목' + actualRowNumber;
          
        updatedStocks.push({
          name: stockName,
          oldPrice: prices.evaluationPrice,
          newPrice: prices.currentPrice,
          difference: prices.currentPrice - prices.evaluationPrice
        });
      }
    }
    
    return {
      totalCount: dataInfo.dataRows.length,
      updateCount: updateCount,
      updatedStocks: updatedStocks
    };
  },
  
  /**
   * 행 데이터에서 가격 정보 추출
   */
  extractPrices: function(rowData, columnIndexes) {
    var evaluationPrice = this.parsePrice(rowData[columnIndexes.evaluationPrice]);
    var currentPrice = this.parsePrice(rowData[columnIndexes.currentPrice]);
    
    return {
      evaluationPrice: evaluationPrice,
      currentPrice: currentPrice
    };
  },
  
  /**
   * 가격 문자열을 숫자로 변환
   */
  parsePrice: function(priceValue) {
    if (typeof priceValue === 'number') {
      return priceValue;
    }
    
    if (typeof priceValue === 'string') {
      // 콤마 제거 후 숫자 변환
      var cleanValue = priceValue.replace(/,/g, '').trim();
      var numericValue = parseFloat(cleanValue);
      return isNaN(numericValue) ? 0 : numericValue;
    }
    
    return 0;
  },
  
  /**
   * 업데이트 조건 확인
   */
  shouldUpdate: function(prices, config) {
    // 기본 조건: 현재가가 평가기준가보다 높아야 함
    if (prices.currentPrice <= prices.evaluationPrice) {
      return false;
    }
    
    // 현재가가 0보다 커야 함 (유효한 가격)
    if (prices.currentPrice <= 0) {
      return false;
    }
    
    // 최소 차이 조건 확인 (설정된 경우)
    if (config.minimumDifference > 0) {
      var difference = prices.currentPrice - prices.evaluationPrice;
      if (difference < config.minimumDifference) {
        return false;
      }
    }
    
    return true;
  }
};
