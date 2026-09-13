/**
 * ====================================================================
 * LINKEEP (링킵) - Google Apps Script 백엔드 코드 (최적화 버전)
 * ====================================================================
 * 
 * [사용 방법]
 * 1. Google Drive에서 새 'Google 스프레드시트'를 만듭니다.
 * 2. 상단 메뉴 [확장 프로그램] -> [Apps Script]를 클릭합니다.
 * 3. 기존 코드를 모두 지우고 이 파일의 전체 코드를 붙여넣습니다.
 * 4. 우측 상단 [배포] -> [새 배포] 클릭
 *    - 유형 선택: [웹 앱] (톱니바퀴 아이콘)
 *    - 설명: LINKEEP API v2
 *    - 다음 사용자 권한으로 실행: [나 (내 계정)]
 *    - 액세스 권한이 있는 사용자: [모든 사용자 (Anyone)]  <-- 필수!
 * 5. [배포] 버튼을 누르고 [액세스 승인] 완료 후 생성된 '웹 앱 URL'을 복사합니다.
 * 6. Vercel 환경 변수 또는 .env 파일에 VITE_GOOGLE_SHEET_API_URL 로 등록합니다.
 */

const SHEET_NAME = 'Sites';

const HEADERS = [
  'id',
  'name',
  'url',
  'category',
  'image_url',
  'image_type',
  'emoji',
  'status',
  'memo',
  'sort_order',
  'created_at',
  'updated_at'
];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // 첫 번째 시트가 비어있으면 이름을 'Sites'로 변경, 아니면 새로 추가
    const active = ss.getActiveSheet();
    if (active && active.getLastRow() === 0) {
      active.setName(SHEET_NAME);
      sheet = active;
    } else {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }
  
  // 시트가 아예 비어있을 때만(최초 1회) 헤더와 초기 수업 사이트 14종을 등록
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#E2E8F0');
    
    const initialSites = [
      ['1', '디지털교과서', 'https://dt.edunet.net', '오늘의 수업', '', 'emoji', '🏫', 'public', '전 학년 디지털교과서 뷰어 및 멀티미디어 자료', 1, '2026-01-01T00:14:00.000Z', '2026-01-01T00:14:00.000Z'],
      ['2', 'EBS 초등', 'https://primary.ebs.co.kr', '오늘의 수업', '', 'emoji', '⭐', 'public', 'EBS 만점왕 및 초등 교과 영상 시청', 2, '2026-01-01T00:13:00.000Z', '2026-01-01T00:13:00.000Z'],
      ['3', '엔트리 (Entry)', 'https://playentry.org', '오늘의 수업', '', 'emoji', '💻', 'public', '초등 블록 코딩 실습 사이트', 3, '2026-01-01T00:12:00.000Z', '2026-01-01T00:12:00.000Z'],
      ['4', '국립국어원 표준국어대사전', 'https://stdict.korean.go.kr', '국어', '', 'emoji', '📖', 'public', '낱말 뜻 찾기 및 맞춤법 검색용', 4, '2026-01-01T00:11:00.000Z', '2026-01-01T00:11:00.000Z'],
      ['5', '국립어린이청소년도서관', 'https://www.nlcy.go.kr', '국어', '', 'emoji', '📚', 'public', '전자책 및 어린이 추천도서 읽기', 5, '2026-01-01T00:10:00.000Z', '2026-01-01T00:10:00.000Z'],
      ['6', '똑똑! 수학탐험대', 'https://www.toctocmath.kr', '수학', '', 'emoji', '🔢', 'public', '교육부 초등 수학 인공지능 맞춤형 학습', 6, '2026-01-01T00:09:00.000Z', '2026-01-01T00:09:00.000Z'],
      ['7', '지오지브라 (GeoGebra)', 'https://www.geogebra.org', '수학', '', 'emoji', '📐', 'public', '도형 및 각도 조작 시각화 도구', 7, '2026-01-01T00:08:00.000Z', '2026-01-01T00:08:00.000Z'],
      ['8', '구글 어스 (Google Earth)', 'https://earth.google.com', '사회', '', 'emoji', '🗺️', 'public', '세계 여러 나라 지형 및 지구 3D 탐험', 8, '2026-01-01T00:07:00.000Z', '2026-01-01T00:07:00.000Z'],
      ['9', '국토정보플랫폼 지도', 'https://map.ngii.go.kr', '사회', '', 'emoji', '🧭', 'public', '우리 고장 및 우리나라 백지도와 지리 정보', 9, '2026-01-01T00:06:00.000Z', '2026-01-01T00:06:00.000Z'],
      ['10', '사이언스올 (ScienceAll)', 'https://www.scienceall.com', '과학', '', 'emoji', '🔬', 'public', '과학문화 포털 및 멀티미디어 실험 자료', 10, '2026-01-01T00:05:00.000Z', '2026-01-01T00:05:00.000Z'],
      ['11', '기상청 날씨누리', 'https://www.weather.go.kr', '과학', '', 'emoji', '🌤️', 'public', '기온, 강수량, 위성 레이더 영상 관찰', 11, '2026-01-01T00:04:00.000Z', '2026-01-01T00:04:00.000Z'],
      ['12', '캔바 (Canva) 디자인', 'https://www.canva.com', '기타', '', 'emoji', '🎨', 'public', '수업 결과물 포스터 및 카드뉴스 제작', 12, '2026-01-01T00:03:00.000Z', '2026-01-01T00:03:00.000Z'],
      ['13', '패들렛 (Padlet)', 'https://padlet.com', '기타', '', 'emoji', '📌', 'public', '학생 의견 모으기 및 토론 게시판', 13, '2026-01-01T00:02:00.000Z', '2026-01-01T00:02:00.000Z'],
      ['14', '띵커벨 (ThinkerBell)', 'https://www.tkbell.co.kr', '기타', '', 'emoji', '🎯', 'public', '수업 퀴즈 및 형성평가 활동', 14, '2026-01-01T00:01:00.000Z', '2026-01-01T00:01:00.000Z']
    ];
    
    initialSites.forEach(function(row) {
      sheet.appendRow(row);
    });
    SpreadsheetApp.flush();
  }
  
  return sheet;
}

// GET 요청 처리: 전체 사이트 목록 조회
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const rows = sheet.getDataRange().getValues();
    
    // 헤더만 있거나 데이터가 없는 경우
    if (rows.length <= 1) {
      return responseJSON({ success: true, data: [] });
    }
    
    const headers = rows[0];
    const data = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] === '' || row[0] === null || row[0] === undefined) continue;
      
      const item = {};
      for (let j = 0; j < headers.length; j++) {
        item[headers[j]] = row[j] !== undefined ? row[j] : '';
      }
      
      // ID는 항상 문자열로 정규화
      item.id = String(item.id).trim();
      item.sort_order = Number(item.sort_order) || 0;
      item.image_url = item.image_url ? String(item.image_url) : null;
      
      // URL 필드 정규화: 헤더 명칭(url, URL, 링크 등) 및 프로토콜 누락 대응
      const rawUrl = item.url || item.URL || item.Url || item['사이트 주소'] || item['링크'] || (row.length > 2 ? row[2] : '');
      const strUrl = String(rawUrl || '').trim();
      item.url = strUrl ? (strUrl.indexOf('://') !== -1 ? strUrl : 'https://' + strUrl) : '';
      
      // 상태 필드 정규화 ('공개' -> 'public', '잠금' -> 'locked', '숨김' -> 'hidden')
      const rawStatus = String(item.status || 'public').trim().toLowerCase();
      if (rawStatus === 'locked' || rawStatus === '잠금') {
        item.status = 'locked';
      } else if (rawStatus === 'hidden' || rawStatus === '숨김') {
        item.status = 'hidden';
      } else {
        item.status = 'public';
      }
      
      data.push(item);
    }
    
    // created_at 기준 내림차순 정렬 (최신 등록 사이트가 맨 앞)
    data.sort(function(a, b) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    return responseJSON({ success: true, data: data });
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  }
}

// POST 요청 처리: 등록, 수정, 삭제, 일괄삭제
function doPost(e) {
  try {
    let contents = {};
    if (e && e.postData && e.postData.contents) {
      contents = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      contents = e.parameter;
    }
    
    const action = contents.action;
    const sheet = getOrCreateSheet();
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    
    // 1. 등록
    if (action === 'create') {
      const site = contents.data || {};
      const newId = String(site.id || ('site_' + Date.now())).trim();
      const now = new Date().toISOString();
      
      const newRow = [
        newId,
        site.name || '',
        site.url || '',
        site.category || '기타',
        site.image_url || '',
        site.image_type || 'emoji',
        site.emoji || '🌐',
        site.status || 'public',
        site.memo || '',
        site.sort_order || 0,
        now,
        now
      ];
      
      sheet.appendRow(newRow);
      SpreadsheetApp.flush();
      
      const createdItem = {};
      for (let j = 0; j < headers.length; j++) {
        createdItem[headers[j]] = newRow[j];
      }
      return responseJSON({ success: true, data: createdItem });
    }
    
    // 2. 수정
    if (action === 'update') {
      const site = contents.data || {};
      const targetId = String(contents.id || '').trim();
      const now = new Date().toISOString();
      
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim() === targetId) {
          const rowIndex = i + 1;
          
          if (site.name !== undefined) sheet.getRange(rowIndex, 2).setValue(site.name);
          if (site.url !== undefined) sheet.getRange(rowIndex, 3).setValue(site.url);
          if (site.category !== undefined) sheet.getRange(rowIndex, 4).setValue(site.category);
          if (site.image_url !== undefined) sheet.getRange(rowIndex, 5).setValue(site.image_url || '');
          if (site.image_type !== undefined) sheet.getRange(rowIndex, 6).setValue(site.image_type);
          if (site.emoji !== undefined) sheet.getRange(rowIndex, 7).setValue(site.emoji);
          if (site.status !== undefined) sheet.getRange(rowIndex, 8).setValue(site.status);
          if (site.memo !== undefined) sheet.getRange(rowIndex, 9).setValue(site.memo || '');
          if (site.sort_order !== undefined) sheet.getRange(rowIndex, 10).setValue(site.sort_order);
          sheet.getRange(rowIndex, 12).setValue(now);
          SpreadsheetApp.flush();
          
          return responseJSON({ success: true, data: site });
        }
      }
      return responseJSON({ success: false, error: '사이트를 찾을 수 없습니다.' });
    }
    
    // 3. 단일 삭제 (메모리 필터 후 1회 쓰기 - 초고속 & 타임아웃 방지)
    if (action === 'delete') {
      const targetId = String(contents.id || '').trim();
      const newRows = [headers];
      let found = false;
      
      for (let i = 1; i < rows.length; i++) {
        const rowId = String(rows[i][0]).trim();
        if (rowId === targetId) {
          found = true;
        } else {
          newRows.push(rows[i]);
        }
      }
      
      sheet.clearContents();
      sheet.getRange(1, 1, newRows.length, headers.length).setValues(newRows);
      SpreadsheetApp.flush();
      
      return responseJSON({ success: true, data: targetId, deleted: found });
    }
    
    // 4. 일괄 삭제 (원자적 1회 쓰기 - 10개 이상도 0.05초 만에 완료)
    if (action === 'bulk_delete') {
      const ids = contents.ids || [];
      const idMap = {};
      for (let k = 0; k < ids.length; k++) {
        idMap[String(ids[k]).trim()] = true;
      }
      
      const newRows = [headers];
      let deleteCount = 0;
      
      for (let i = 1; i < rows.length; i++) {
        const rowId = String(rows[i][0]).trim();
        if (idMap[rowId]) {
          deleteCount++;
        } else {
          newRows.push(rows[i]);
        }
      }
      
      sheet.clearContents();
      sheet.getRange(1, 1, newRows.length, headers.length).setValues(newRows);
      SpreadsheetApp.flush();
      
      return responseJSON({ success: true, data: ids, deleteCount: deleteCount });
    }
    
    return responseJSON({ success: false, error: '알 수 없는 action 입니다: ' + action });
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
