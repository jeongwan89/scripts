// 포커스 이동 옵션을 가진 함수
function returnToOriginalCell(spreadsheet, sheetName, row, column, options) {
  options = options || {};
  var focusType = options.focusType || "trigger"; // "trigger", "next", "id"
  
  try {
    var originalSheet = spreadsheet.getSheetByName(sheetName);
    if (!originalSheet) {
      console.log("원래 시트를 찾을 수 없음:", sheetName);
      return;
    }
    
    // 시트 이동
    spreadsheet.setActiveSheet(originalSheet);
    
    var targetColumn = column;
    
    // 포커스 타입에 따른 셀 선택
    switch (focusType) {
      case "trigger":
        // 트리거가 발생한 셀 (L열)
        targetColumn = column;
        break;
      case "next":
        // 다음 열로 이동 (L열 다음인 M열)
        targetColumn = column + 1;
        break;
      case "id":
        // 고유번호가 생성된 셀 (A열)
        targetColumn = 1;
        break;
      default:
        targetColumn = column;
    }
    
    // 셀 포커스 이동
    var targetCell = originalSheet.getRange(row, targetColumn);
    originalSheet.setActiveRange(targetCell);
    
    console.log("포커스 이동 완료:", targetCell.getA1Notation());
    
  } catch (error) {
    console.log("포커스 이동 오류:", error.toString());
  }
}

// 간단한 데이터 복사 테스트 함수
function testDataCopy() {
  console.log("데이터 복사 테스트 시작");
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = spreadsheet.getSheetByName("매매기록");
  
  if (!mainSheet) {
    console.log("매매기록 시트를 찾을 수 없습니다.");
    return;
  }
  
  // 2행의 데이터를 테스트로 복사
  var testRow = 2;
  var rowData = mainSheet.getRange(testRow, 1, 1, mainSheet.getLastColumn()).getValues()[0];
  var stockName = mainSheet.getRange(testRow, 3).getValue(); // C열에서 종목명 가져오기
  
  console.log("테스트 데이터:", rowData);
  console.log("종목명:", stockName);
  
  if (stockName && stockName !== "") {
    copyToStockSheet(spreadsheet, stockName, rowData);
  } else {
    console.log("C열에 종목명이 없습니다.");
  }
}

// 현재 시트 이름 확인 함수
function checkSheetName() {
  var sheet = SpreadsheetApp.getActiveSheet();
  console.log("현재 시트 이름:", sheet.getName());
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var allSheets = spreadsheet.getSheets();
  
  console.log("모든 시트 목록:");
  for (var i = 0; i < allSheets.length; i++) {
    console.log("- " + allSheets[i].getName());
  }
}

// 테스트용 함수 (수동 실행으로 권한 확인)
function testFunction() {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange("Z1").setValue("스크립트 작동 테스트: " + new Date());
  console.log("테스트 함수 실행됨");
}

// onEdit 시뮬레이션 테스트 함수 (수동 실행용)
function testOnEditSimulation() {
  console.log("onEdit 시뮬레이션 테스트 시작");
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("매매기록"); // 실제 시트 이름으로 수정
  
  if (!sheet) {
    console.log("'매매기록' 시트를 찾을 수 없습니다. checkSheetName 함수를 실행해서 정확한 시트 이름을 확인하세요.");
    return;
  }
  
  // L2 셀에 테스트 데이터 입력 (트리거용)
  sheet.getRange("L2").setValue("테스트트리거");
  
  // C2에 종목명 입력
  var testStockName = "테스트종목";
  sheet.getRange("C2").setValue(testStockName);
  
  // 수동으로 고유번호 생성
  generateUniqueId(sheet, 2, 1);
  
  // 행 데이터 가져오기
  var rowData = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // 종목별 시트로 복사
  copyToStockSheet(spreadsheet, testStockName, rowData);
  
  console.log("시뮬레이션 테스트 완료");
}

// 간단한 onEdit 테스트 (임시)
function onEditSimple(e) {
  if (!e || !e.source) {
    console.log("onEdit이 수동으로 실행됨 - 이는 오류입니다!");
    return;
  }
  
  var sheet = e.source.getActiveSheet();
  console.log("onEdit 실행됨 - 시트:", sheet.getName(), "셀:", e.range.getA1Notation());
  
  // Z1에 실행 로그 남기기
  sheet.getRange("Z1").setValue("onEdit 실행됨: " + new Date());
}

// 메인 onEdit 함수
function onEdit(e) {
  // 디버깅: onEdit이 호출되는지 확인
  console.log("onEdit 호출됨!", new Date());
  
  if (!e || !e.source) {
    console.log("onEdit 매개변수 오류");
    return;
  }
  
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var spreadsheet = e.source;
  
  // 디버깅: 편집 정보 로깅
  console.log("편집된 시트:", sheet.getName());
  console.log("편집된 셀:", range.getA1Notation());
  console.log("편집된 값:", range.getValue());
  
  try {
    // 설정값들 - 매매기록 시트 이름으로 설정
    var MAIN_SHEET_NAME = "매매기록"; // 실제 메인 시트 이름
    var DATA_COLUMN = 12;     // L열 (데이터 입력 감지용) - C열(3)에서 L열(12)로 변경
    var ID_COLUMN = 1;        // A열 (고유번호 생성될 열)
    var STOCK_COLUMN = 3;     // C열 (종목명 - 실제 종목이 있는 열)
    var HEADER_ROW = 1;       // 헤더 행
    
    // 메인 시트에서만 작동하도록 제한
    if (sheet.getName() !== MAIN_SHEET_NAME) {
      console.log("다른 시트에서 편집됨:", sheet.getName());
      return;
    }
    
    // 고유번호 생성으로 인한 재귀 호출 방지
    if (range.getColumn() == ID_COLUMN) {
      console.log("고유번호 열 편집됨 - 무시");
      return;
    }
    
    // L열에 데이터가 입력되고, 헤더행이 아닐 때 실행
    if (range.getColumn() == DATA_COLUMN && range.getRow() > HEADER_ROW) {
      var currentRow = range.getRow();
      var triggerValue = range.getValue(); // L열에 입력된 값
      var stockName = sheet.getRange(currentRow, STOCK_COLUMN).getValue(); // C열의 종목명
      var uniqueId = sheet.getRange(currentRow, ID_COLUMN).getValue(); // A열의 고유번호

      console.log("L열에 값 입력됨:", triggerValue, "종목:", stockName, "고유번호:", uniqueId);

      if (triggerValue === "입력" && stockName && stockName !== "") {
        // 이미 고유번호가 있는지 확인 (중복 실행 방지)
        if (uniqueId && uniqueId !== "") {
          console.log("이미 처리된 행입니다. 고유번호:", uniqueId);
          return;
        }

        console.log("처리 시작 - 종목:", stockName);

        // 1. 고유번호 자동생성 (Apps Script의 Lock 서비스 사용으로 동시 실행 방지)
        var lock = LockService.getScriptLock();
        try {
          lock.waitLock(1000);
          generateUniqueId(sheet, currentRow, ID_COLUMN);
          Utilities.sleep(100);
        } catch (e) {
          console.log("Lock 획득 실패:", e.toString());
          return;
        } finally {
          lock.releaseLock();
        }

        // 2. 전체 행 데이터 가져오기 (고유번호 생성 후)
        var rowData = sheet.getRange(currentRow, 1, 1, sheet.getLastColumn()).getValues()[0];
        var hasData = rowData.some(function(val) { return val && val !== ""; });
        if (!hasData) {
          console.log("경고: 행에 데이터가 없습니다!");
          return;
        }

        // 3. 종목별 시트로 데이터 복사
        copyToStockSheet(spreadsheet, stockName, rowData);

        // 처리 완료 후 원래 셀로 포커스 돌려놓기
        returnToOriginalCell(spreadsheet, "매매기록", currentRow, DATA_COLUMN, {
          focusType: "trigger"
        });
        console.log("처리 완료 - 종목:", stockName);
      } else if (triggerValue === "삭제" && stockName && stockName !== "" && uniqueId && uniqueId !== "") {
        // L열에 '삭제'가 입력된 경우: 분개장 시트에서 고유번호로 행 삭제
        console.log("삭제 요청 - 종목:", stockName, "고유번호:", uniqueId);
        var stockSheet = spreadsheet.getSheetByName(stockName);
        if (!stockSheet) {
          console.log("종목 시트를 찾을 수 없습니다:", stockName);
        } else {
          var lastRow = stockSheet.getLastRow();
          var idCol = 1; // 종목 시트의 고유번호는 A열(1)
          var foundRow = null;
          for (var r = 2; r <= lastRow; r++) {
            var idVal = stockSheet.getRange(r, idCol).getValue();
            if (idVal === uniqueId) {
              foundRow = r;
              break;
            }
          }
          if (foundRow) {
            stockSheet.deleteRow(foundRow);
            console.log("분개장 시트에서 행 삭제 완료:", foundRow);
          } else {
            console.log("분개장 시트에서 고유번호를 찾지 못함:", uniqueId);
          }
        }
        // 원본 시트의 고유번호와 L열 값도 삭제. 통체로 삭제되기에 셀 단위로 지우는 것은 의미없음
        // sheet.getRange(currentRow, ID_COLUMN).setValue("");
        // sheet.getRange(currentRow, DATA_COLUMN).setValue("");
        // console.log("원본 시트 고유번호 및 L열 값 삭제 완료");
        // 통채로 삭제
        sheet.deleteRow(currentRow);
        console.log("원본 시트에서 행 삭제 완료:", currentRow);
      } else {
        // L열 데이터가 삭제되면 고유번호도 삭제 (선택사항)
        if (!triggerValue || triggerValue === "") {
          var idCell = sheet.getRange(range.getRow(), ID_COLUMN);
          idCell.setValue("");
          console.log("L열 값 삭제됨, 고유번호도 삭제");
        }
      }
    }
  } catch (error) {
    console.error("onEdit 오류:", error.toString());
  }
}

// 고유번호 생성 함수
function generateUniqueId(sheet, row, idColumn) {
  var idCell = sheet.getRange(row, idColumn);
  
  // 이미 고유번호가 있으면 생성하지 않음
  if (idCell.getValue() && idCell.getValue() !== "") {
    console.log("이미 고유번호 존재:", idCell.getValue());
    return;
  }
  
  // 고유번호 생성 (날짜 + 시간 + 랜덤숫자)
  var now = new Date();
  var dateStr = Utilities.formatDate(now, "GMT+9", "yyyyMMdd");
  var timeStr = Utilities.formatDate(now, "GMT+9", "HHmmss");
  var randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  var uniqueId = dateStr + "-" + timeStr + "-" + randomNum;
  
  // 고유번호 입력
  idCell.setValue(uniqueId);
  
  console.log("고유번호 생성됨:", uniqueId, "(행:", row + ")");
}

// 종목별 시트로 데이터 복사 함수
function copyToStockSheet(spreadsheet, stockName, rowData) {
  console.log("copyToStockSheet 시작 - 종목:", stockName);
  console.log("복사할 데이터:", rowData);
  
  var stockSheetName = stockName;
  var stockSheet;
  var isNewSheet = false;
  
  try {
    stockSheet = spreadsheet.getSheetByName(stockSheetName);
    console.log("기존 종목 시트 찾음:", stockSheetName);
  } catch (error) {
    console.log("종목 시트 없음, 새로 생성할 예정:", stockSheetName);
    stockSheet = null;
  }
  
  // 종목 시트가 없으면 새로 생성
  if (!stockSheet) {
    try {
      stockSheet = spreadsheet.insertSheet(stockSheetName);
      isNewSheet = true;
      console.log("새 종목 시트 생성 성공:", stockSheetName);
      
      // 헤더 추가
      var headers = ["거래번호", "거래날짜", "종목", "평균가", "매수량", "매수단가", 
                     "매도량", "매도단가", "잔고량", "비고", "실현손익", "명령"];
      stockSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // 헤더 스타일링
      var headerRange = stockSheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#4285f4");
      headerRange.setFontColor("white");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      
      // 열 너비 자동 조정
      stockSheet.autoResizeColumns(1, headers.length);
      
      console.log("헤더 설정 완료");
    } catch (error) {
      console.error("시트 생성 오류:", error.toString());
      return;
    }
  }
  
  try {
    // 새 데이터를 종목 시트에 추가
    var lastRow = stockSheet.getLastRow();
    console.log("현재 마지막 행:", lastRow);
    
    // rowData가 올바른 배열인지 확인
    if (!rowData || !Array.isArray(rowData)) {
      console.error("rowData가 올바르지 않음:", typeof rowData, rowData);
      return;
    }
    
    console.log("데이터 길이:", rowData.length);
    console.log("추가할 행 번호:", lastRow + 1);
    
    // 데이터 추가
    var targetRange = stockSheet.getRange(lastRow + 1, 1, 1, rowData.length);
    console.log("목표 범위:", targetRange.getA1Notation());

    targetRange.setValues([rowData]);

    // D열(4번째 열)에 수식 추가
    var newRow = lastRow + 1;
    var prevRow = newRow - 1;
    if (newRow > 2) { // 2행은 헤더, 3행부터 수식 적용
      var formulaD = `=IF(E${newRow},(D${prevRow}*I${prevRow}+E${newRow}*F${newRow})/I${newRow},D${prevRow})`;
      stockSheet.getRange(newRow, 4).setFormula(formulaD);
      console.log("D열 수식 추가:", formulaD);

      // K열(11번째 열)에 수식 추가
      var formulaK = `=if(G${newRow},-I${prevRow}*D${newRow}+G${newRow}*H${newRow}-E${newRow}*F${newRow},0)`;
      stockSheet.getRange(newRow, 11).setFormula(formulaK);
      console.log("K열 수식 추가:", formulaK);

     // I열(9번째 열)에 수식 추가
      var formulaI = `=I${prevRow}-G${newRow}+E${newRow}`;
      stockSheet.getRange(newRow, 9).setFormula(formulaI);
      console.log("I열 수식 추가:", formulaI);
    }

    console.log("데이터 추가 성공 - " + stockSheetName + " 시트, 행:" + newRow);
    console.log("추가된 데이터 확인:", stockSheet.getRange(newRow, 1, 1, rowData.length).getValues()[0]);

    // 새 시트가 생성되었다면 원래 시트의 원래 셀로 돌아가기
    if (isNewSheet) {
      try {
        var originalSheet = spreadsheet.getSheetByName("매매기록");
        if (originalSheet) {
          spreadsheet.setActiveSheet(originalSheet);
          console.log("매매기록 시트로 돌아감");
        }
      } catch (error) {
        console.log("시트 복귀 오류:", error.toString());
      }
    }
    
  } catch (error) {
    console.error("데이터 추가 오류:", error.toString());
    console.error("오류 상세:", error.stack);
  }
}

// 기존 데이터에 고유번호 생성 + 종목별 분류 (한번만 실행)
function migrateBulkData() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var mainSheet = spreadsheet.getSheetByName("매매기록"); // 매매기록 시트
  
  if (!mainSheet) {
    console.log("'매매기록' 시트를 찾을 수 없습니다. 'checkSheetName' 함수를 실행해서 정확한 시트 이름을 확인하세요.");
    return;
  }
  
  var lastRow = mainSheet.getLastRow();
  
  for (var row = 2; row <= lastRow; row++) {
    var triggerCell = mainSheet.getRange(row, 12); // L열 (트리거 셀)
    var stockCell = mainSheet.getRange(row, 3); // C열 (종목)
    var triggerValue = triggerCell.getValue();
    var stockName = stockCell.getValue();
    
    // L열에 값이 있고 C열에 종목이 있는 경우에만 처리
    if (triggerValue && triggerValue !== "" && stockName && stockName !== "") {
      // 1. 고유번호 생성 (없는 경우에만)
      generateUniqueId(mainSheet, row, 1);
      
      // 잠시 대기 (고유번호 생성 완료 후)
      Utilities.sleep(10);
      
      // 2. 전체 행 데이터 가져오기
      var rowData = mainSheet.getRange(row, 1, 1, mainSheet.getLastColumn()).getValues()[0];
      
      // 3. 종목별 시트로 복사
      copyToStockSheet(spreadsheet, stockName, rowData);
      
      // 각 행 처리 후 잠시 대기
      Utilities.sleep(50);
    }
  }
  
  console.log("기존 데이터 일괄 처리 완료");
}

// 종목별 통계 생성 함수
function generateStockSummary() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = spreadsheet.getSheets();
  var summaryData = [];
  
  // 헤더
  summaryData.push(["종목", "총거래수", "총매수량", "총매도량", "현재잔고", "실현손익합계"]);
  
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    var sheetName = sheet.getName();
    
    // 메인 시트나 요약 시트는 제외
    if (sheetName === "매매기록" || sheetName === "종목별요약") {
      continue;
    }
    
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) continue; // 데이터가 없는 시트는 제외
    
    var data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    
    var totalTrades = data.length;
    var totalBuy = 0;
    var totalSell = 0;
    var currentBalance = 0;
    var totalProfit = 0;
    
    for (var j = 0; j < data.length; j++) {
      totalBuy += parseFloat(data[j][4]) || 0; // 매수량
      totalSell += parseFloat(data[j][6]) || 0; // 매도량
      currentBalance = parseFloat(data[j][8]) || 0; // 잔고량 (마지막 값)
      totalProfit += parseFloat(data[j][10]) || 0; // 실현손익
    }
    
    summaryData.push([sheetName, totalTrades, totalBuy, totalSell, currentBalance, totalProfit]);
  }
  
  // 종목별 요약 시트 생성 또는 업데이트
  var summarySheet;
  try {
    summarySheet = spreadsheet.getSheetByName("종목별요약");
    summarySheet.clear();
  } catch (error) {
    summarySheet = spreadsheet.insertSheet("종목별요약");
  }
  
  if (summaryData.length > 1) {
    summarySheet.getRange(1, 1, summaryData.length, summaryData[0].length).setValues(summaryData);
    
    // 스타일링
    var headerRange = summarySheet.getRange(1, 1, 1, summaryData[0].length);
    headerRange.setBackground("#34a853");
    headerRange.setFontColor("white");
    headerRange.setFontWeight("bold");
    
    summarySheet.autoResizeColumns(1, summaryData[0].length);
  }
  
  console.log("종목별 요약 시트 생성 완료");
}

//////////////////////////////////////////////////
/**
 * 스프레드시트가 열릴 때 자동 실행되어 메뉴를 생성합니다
 */
function onOpen() {
  StockMenuHandler.createStockMenu();
}

/**
 * 메뉴에서 호출되는 메인 실행 함수
 */
function executeUpdateEvaluationPrice() {
  StockPriceUpdater.updateEvaluationPrice();
}

// ==================== 추가 유틸리티 함수들 (Code.gs에 추가) ====================
/**
 * 도움말 표시
 */
function showHelp() {
  var helpMessage = 
    '📈 주식 평가기준가 업데이트 도구\n\n' +
    '▶️ 기능:\n' +
    '• A종가가 평가기준가보다 높을 때 평가기준가를 A종가로 업데이트합니다.\n\n' +
    '▶️ 필요한 컬럼:\n' +
    '• "평가기준가": 업데이트할 기준가격\n' +
    '• "A종가": 현재 주식 가격\n\n' +
    '▶️ 사용법:\n' +
    '1. 메뉴에서 "평가기준가 업데이트" 클릭\n' +
    '2. 결과 확인\n\n' +
    '※ 안전을 위해 실행 전 데이터를 백업해주세요.';
    
  UIManager.showSuccess(helpMessage);
}

/**
 * 앱 정보 표시
 */
function showAppInfo() {
  var config = StockConfig.getAppSettings();
  var infoMessage = 
    config.appName + '\n' +
    'Version: ' + config.version + '\n\n' +
    '개발: Google Apps Script\n' +
    '용도: 주식 포트폴리오 관리';
    
  UIManager.showSuccess(infoMessage);
}

function getKoreanStock(code) {
  var url = "https://finance.naver.com/item/main.nhn?code=" + code;
  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText();
  
  // HTML 파싱하여 주가 추출
  var regex = /<span class="blind">현재가<\/span>\s*<strong[^>]*>([^<]*)<\/strong>/;
  var match = html.match(regex);
  
  if (match) {
    return match[1].replace(/,/g, '');
  }
  return "데이터 없음";
}

function test_getKoreanStock() {
  var testCode = "0047A0"; // 삼성전자 예시
  var result = getKoreanStock(testCode);
  Logger.log("테스트 결과: " + result);
}

/**
 * 종목 코드로 네이버 금융에서 현재가를 가져오는 함수 (숫자 반환)
 * @param {string} code 종목 코드 (예: "0047A0", "005930")
 * @return {number} 현재가 (숫자)
 */
function KOREA_STOCK(code) {
  try {
    var url = "https://finance.naver.com/item/main.nhn?code=" + code;
    var options = {
      "muteHttpExceptions": true,
      "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    };
    var response = UrlFetchApp.fetch(url, options);
    var html = response.getContentText();

    // 패턴 A: <span class="blind">현재가</span> … <strong>13,500</strong>
    var patternA = /<span\s+class="blind">현재가<\/span>\s*<\/?[^>]*>\s*<strong[^>]*>([\d,]+)<\/strong>/i;
    var matchA = html.match(patternA);
    if (matchA && matchA[1]) {
      return parseFloat(matchA[1].replace(/,/g, ""));
    }

    // 패턴 B: <p class="no_today"> … <span class="blind">13,500</span>
    var patternB = /<p\s+class="no_today">[\s\S]*?<span\s+class="blind">([\d,]+)<\/span>/i;
    var matchB = html.match(patternB);
    if (matchB && matchB[1]) {
      return parseFloat(matchB[1].replace(/,/g, ""));
    }

    return NaN; // 파싱 실패 시 숫자형 NaN 반환
  } catch (e) {
    return NaN; // 오류 시에도 NaN 반환
  }
}

function refreshAllStocks() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getRange("Z1");  // 잘 안 쓰는 셀
  cell.setValue(new Date());        // 값 갱신 → 시트 재계산 유도
}

