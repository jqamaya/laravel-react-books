
function convertToCSV<T>(objArray: Array<T>) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = Object.keys(array[0]).join(',') + '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line !== '') line += ',';

      line += array[i][index];
    }
    str += line + '\r\n';
  }
  return str;
};

function convertToXML<T>(objArray: Array<T>) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '<?xml version="1.0" encoding="UTF-8"?>\r\n<Data>';

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const id = 'id' in item ? item['id'] : '';
    let line = `\r\n\t<Item id="${id}">`;
    for (let key in item) {
      if (key === 'id') continue;
      if (line !== '') line += '\r\n';

      line += `\t\t<${key}>${item[key]}</${key}>`;
    }
    str += line + '\n\t</Item>\r\n';
  }
  str += '</Data>';
  return str;
};

export function downloadCSV<T>(
  { data, fileName } : { data: Array<T>, fileName: string }
) {
  const csvData = new Blob(
    [convertToCSV(data)],
    { type: 'text/csv' },
  );
  const csvURL = URL.createObjectURL(csvData);
  const link = document.createElement('a');
  link.href = csvURL;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function downloadXML<T>(
  { data, fileName } : { data: Array<T>, fileName: string }
) {
  const xmlData = new Blob(
    [convertToXML(data)],
    { type: 'text/xml' },
  );
  const csvURL = URL.createObjectURL(xmlData);
  const link = document.createElement('a');
  link.href = csvURL;
  link.download = `${fileName}.xml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
