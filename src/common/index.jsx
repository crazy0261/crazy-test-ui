import JSONbig from 'json-bigint';

/**
 * 修改tree，action返回修改后的item， 不修改就不返回
 */
export const deepTree = (tree = [], action = () => {}) => {
  return tree.map((item) => {
    const newItem = action({ ...item }) || item;
    if (newItem.children) {
      newItem.children = deepTree(newItem.children, action);
    }
    return newItem;
  });
};

// 优先级列表
export const priorityList = [
  { value: 0, label: 'P0' },
  { value: 1, label: 'P1' },
  { value: 2, label: 'P2' },
  { value: 3, label: 'P3' },
];

export const priorityEnum = {
  0: {
    text: 'P0',
  },
  1: {
    text: 'P1',
  },
  2: {
    text: 'P2',
  },
  3: {
    text: 'P3',
  },
};

export const arrayToJson = (array) => {
  if (array !== undefined && array !== null) {
    let json = {};
    for (let i = 0; i < array.length; i++) {
      let key = array[i]['key'];
      let value = array[i]['value'];
      if (key !== undefined && key !== null) {
        json[key] = value;
      }
    }
    return JSON.stringify(json);
  } else {
    return null;
  }
};

export const jsonToArray = (jsonReq) => {
  let array = new Array();
  const json = JSONbig.parse(jsonReq);
  if (json !== undefined && json !== null) {
    for (let key of Object.keys(json)) {
      let jsonObj = {};
      jsonObj['id'] = Math.random();
      jsonObj['key'] = key;
      jsonObj['value'] = json[key];
      array.push(jsonObj);
    }
  }
  return array;
};

// 去除空环境变量
export const trimEnvParams = (envParams) => {
  if (envParams === undefined || envParams === null) {
    return null;
  }
  let envParamsRes = [];
  for (let i = 0; i < envParams.length; i++) {
    if (envParams[i].key !== undefined) {
      envParamsRes.push(envParams[i]);
    }
  }
  return envParamsRes;
};

// 生成JSON格式环境变量
export const genJsonEnvVar = (
  testEnvParams,
  testAccountInTest,
  demoEnvParams,
  testAccountInDemo,
  prodEnvParams,
  testAccountInProd,
) => {
  let envVar = {};
  let envVarInTest = {};
  envVarInTest['envVariables'] = trimEnvParams(testEnvParams);
  envVarInTest['testaccountID'] = testAccountInTest;
  envVar['1'] = envVarInTest;
  let envVarInDemo = {};
  envVarInDemo['envVariables'] = trimEnvParams(demoEnvParams);
  envVarInDemo['testaccountID'] = testAccountInDemo;
  envVar['2'] = envVarInDemo;
  let envVarInProd = {};
  envVarInProd['envVariables'] = trimEnvParams(prodEnvParams);
  envVarInProd['testaccountID'] = testAccountInProd;
  envVar['3'] = envVarInProd;
  return JSON.stringify(envVar);
};

// 获取测试账号id
export const getTestAccount = (envVariables, envId) => {
  if (envVariables === undefined || envVariables === null || envVariables === '') {
    return null;
  }
  let envVarJSON = JSONbig.parse(envVariables);
  if (envVarJSON[envId] !== undefined && envVarJSON[envId] !== null) {
    const testaccountID = envVarJSON[envId]['testaccountID'];
    return testaccountID === undefined ? null : testaccountID;
  } else {
    return null;
  }
};

// 生成环境变量Array
export const genEnvVarArray = (envVariables, envId) => {
  if (envVariables === undefined || envVariables === null || envVariables === '') {
    return [];
  }
  let envVarJSON = JSONbig.parse(envVariables);
  if (envVarJSON[envId] !== undefined && envVarJSON[envId] !== null) {
    const envVariables = envVarJSON[envId]['envVariables'];
    return envVariables === undefined || envVariables === null ? [] : envVariables;
  } else {
    return [];
  }
};
