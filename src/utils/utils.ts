import { IFileResponse } from './request';
import type { Column, Worksheet } from 'exceljs';
import { isNumber } from 'lodash-es';
import { saveAs } from 'file-saver';

export const LOCAL_MENU = import.meta.env.VITE_LOCAL_MENU === 'true';

export const formSheetToOption = (sheet: any) => {
  return Object.keys(sheet).map((item) => {
    return {
      label: sheet[item],
      value: parseInt(item),
    };
  });
};

export const formSheetToOptionStringValue = (sheet: any) => {
  return Object.keys(sheet).map((item) => {
    return {
      label: sheet[item],
      value: item,
    };
  });
};

export const formMapToOption = <K, V>(sheet: Map<K, V>) => {
  return [...sheet.entries()].map((item) => {
    return {
      label: item[1],
      value: item[0],
    };
  });
};

export const clearEmptyFields = <T extends Record<string, any>>(data: T): T => {
  return Object.keys(data).reduce((acc, key) => {
    if ((data as any)[key] !== '') {
      acc[key] = (data as any)[key];
    }
    return acc;
  }, {} as any);
};

export function modifyKeyNameForRecordList(data: Record<string, any>[], sheet: Record<string, string>) {
  return data.map((item) =>
    Object.keys(item).reduce((acc, key) => {
      acc[sheet[key]] = item[key];
      return acc;
    }, {} as Record<string, any>),
  );
}

export async function exportExcel(option: {
  fileName: string;
  column: Partial<Column>[];
  data: Record<string, any>[];
  multiLevelHeaders?: (string | undefined)[][];
  mergeCellList?: [number, number, number, number][];
}) {
  const { Workbook } = await import('exceljs');
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('sheet1', { views: [{ showGridLines: true }] });
  // 处理多级表头（如果存在）
  if (option.multiLevelHeaders) {
    worksheet.columns = option.column.map((item) => ({ ...item, header: '' }));
    handleMultiLevelHeaders(worksheet, option.multiLevelHeaders);
  } else {
    worksheet.columns = option.column;
  }
  if (option.mergeCellList) {
    option.mergeCellList.map((item) => {
      worksheet.mergeCells(item);
    });
  }
  worksheet.addRows(option.data);
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, option.fileName + '.xlsx');
  });
}

function handleMultiLevelHeaders(worksheet: Worksheet, headers: (string | undefined)[][]) {
  const meargeList: [number, number, number, number][] = [];
  headers.forEach((headerRow, rowIndex) => {
    let startCellIndex = 0;
    let endCellIndex = 0;
    headerRow.forEach((cellValue, cellIndex) => {
      const cell = worksheet.getCell(rowIndex + 1, cellIndex + 1);
      if (cellValue !== void 0) {
        if (endCellIndex - startCellIndex >= 1) {
          meargeList.push([rowIndex + 1, startCellIndex + 1, rowIndex + 1, endCellIndex + 1]);
        }
        startCellIndex = cellIndex;
      } else {
        endCellIndex = cellIndex;
        if (cellIndex === headerRow.length - 1) {
          meargeList.push([rowIndex + 1, startCellIndex + 1, rowIndex + 1, endCellIndex + 1]);
        }
      }
      cell.value = cellValue;
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
    });
  });
  meargeList.forEach((item) => {
    worksheet.mergeCells(item);
  });
}

// 将平铺的数组，转换成树状的数据
export function dealTileToTree<T>(list: Array<T>, flag: keyof T, pFlag: keyof T, heads: any[]) {
  type Tree = T & { children: Tree[] };
  const data: Tree[] = list.map((item) => {
    return {
      ...item,
      children: [],
    };
  });
  const firstLevel = data.filter((item) => heads.includes(item[pFlag]));
  let otherList = data.filter((item) => !heads.includes(item[pFlag]));
  const dfs = (parentList: Tree[]) => {
    if (otherList.length === 0) return;
    parentList.forEach((item) => {
      item.children = otherList.filter((e) => e[pFlag] === item[flag]);
      otherList = otherList.filter((e) => e[pFlag] !== item[flag]);
      dfs(item.children);
    });
  };
  dfs(firstLevel);
  return firstLevel;
}

export function dealTileToTreeWithoutHead<T>(list: Array<T>, flag: keyof T, pFlag: keyof T) {
  const ids: Set<any> = new Set();
  const pids: Set<any> = new Set();
  list.forEach((item) => {
    ids.add(item[flag]);
    pids.add(item[pFlag]);
  });
  const heads = [...pids].filter((x) => !ids.has(x));
  return dealTileToTree(list, flag, pFlag, heads);
}

export function dfsSort<T extends { children?: T[] }>(list: Array<T>, flag: keyof T) {
  const dfs = (childList: Array<T>) => childList.sort((a, b) => ((a[flag] as any) - (b[flag] as any) > 0 ? 1 : -1));
  const result = dfs(list);
  list.forEach((item) => {
    if (item.children && item.children instanceof Array && item.children.length > 0) {
      item.children = dfs(item.children);
    }
  });
  return result;
}

export function checkFileType(fileName: string, typeList: string[]): boolean {
  const fileNameSplit = fileName.split('.');
  return typeList.includes(('.' + fileNameSplit[fileNameSplit.length - 1]).toLowerCase());
}

export function downloadFileResponse(data: IFileResponse, customFileName = '未设置文件名') {
  const url = window.URL.createObjectURL(new Blob([data.file]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', data.fileName || customFileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadFileByUrl(url: string) {
  const link = document.createElement('a');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const exportToImage = async (element: HTMLElement, fileName = 'screenshot') => {
  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imgData;
  link.download = fileName + 'png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async function (element: HTMLElement, fileName = 'download') {
  const html2canvas = (await import('html2canvas')).default;
  const jspdf = (await import('jspdf')).default;
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jspdf({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(fileName + 'pdf');
};

export interface ImageModuleParams {
  buffer: Uint8Array;
  width: number;
  height: number;
}
export async function convertHtmlToImageModule(element: HTMLElement) {
  const html2canvas = (await import('html2canvas')).default;
  return new Promise<ImageModuleParams>((resolve, reject) => {
    html2canvas(element, { useCORS: true, scale: 2 }).then(
      (canvas) => {
        const base64Image = canvas.toDataURL('image/png');
        const base64Data = base64Image.split(',')[1];
        const binaryString = window.atob(base64Data);
        const arrayBuffer = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          arrayBuffer[i] = binaryString.charCodeAt(i);
        }
        resolve({
          buffer: arrayBuffer,
          width: canvas.width,
          height: canvas.height,
        });
      },
      (error) => {
        reject(error);
      },
    );
  });
}

const readFile = (blod: Blob) => {
  return new Promise((resolve, reject) => {
    const binaryReader = new FileReader();
    binaryReader.onload = (e) => {
      if (e.target) resolve(e.target.result);
      else reject(e);
    };
    binaryReader.onerror = (e) => {
      reject(e);
    };
    binaryReader.readAsArrayBuffer(blod);
  });
};

export async function exportToDocx(templatePath: string, data: Record<string, any>, fileName?: string) {
  const docxtemplater = (await import('docxtemplater')).default;
  const pizzip = (await import('pizzip')).default;
  const ImageModule = (await import('@slosarek/docxtemplater-image-module-free')).default;
  const imageOptions = {
    centered: false,
    getImage(tagValue: ImageModuleParams) {
      return tagValue.buffer;
    },
    getSize(uint8: Uint8Array, tagValue: ImageModuleParams) {
      return [560, (560 / tagValue.width) * tagValue.height];
    },
  };
  const response = await fetch(templatePath);
  const url = decodeURI(response.url).split('/');
  const fileNamePre = url[url.length - 1].split('.')[0];
  const blob = await response.blob();
  const buf = await readFile(blob);
  const zip = new pizzip(buf as any);
  const doc = new docxtemplater(zip, {
    modules: [new ImageModule(imageOptions)],
  });
  doc.render(data);
  const out = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  saveAs(out, fileName || fileNamePre);
  return true;
}

export const getEchartsTooltipMarker = (color: string) => {
  return `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`;
};

export const getEchartsTooltipContent = (dataList: ([string, string | undefined | number] | string)[]) => {
  return `
    <div style="display:flex;flex-direction:column">
      ${dataList.reduce((previous, current) => {
        return (
          previous +
          `
            <div style="display:flex;align-items:center;width:100%;justify-content:space-between">
            ${
              current instanceof Array
                ? `<div>${current[0]}</div><div style="margin-left:30px; font-weight:bold">${current[1] ?? '-'}</div>`
                : `<div style="font-weight:bold">${current}</div>`
            }
            </div>
          `
        );
      }, '')}
    </div>
  `;
};

export function mixMap(a: Map<number | string, string>, b: Map<number | string, string>) {
  const result = new Map<string, string>();
  [...a.keys()].forEach((item) => {
    [...b.keys()].forEach((e) => {
      result.set(item + '_' + e, a.get(item)! + '_' + b.get(e)!);
    });
  });
  return result;
}

export function checkNumber(data: any[]): boolean {
  return data.reduce((result, item) => {
    if (!isNumber(item)) {
      return false;
    } else {
      return result;
    }
  }, true);
}

/**
 * 用于根据窗口大小，动态的缩放页面，保证与设计图一致
 * @param el 页面元素或者元素的id
 * @param originWidth 设计图的宽度
 * @returns 无
 */
export function autoFitScreen(el: HTMLElement | string, originWidth = 1920) {
  let element: HTMLElement;
  if (typeof el === 'string') {
    const ele = document.getElementById('qh-display-box');
    if (!ele) return;
    element = ele;
  } else {
    element = el;
  }
  element.style.transform = `scale(${window.innerWidth / originWidth})`;
  element.style.width = (originWidth / window.innerWidth) * 100 + '%';
  element.style.height = (originWidth / window.innerWidth) * 100 + '%';
  element.style.transformOrigin = '0 0';
}
