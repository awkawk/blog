/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const BULKOPERATIONS_CONFIG = '/en/drafts/alex/bulkoperationsconfig.json';
const CLIENT_ID = '49ae1d16-63eb-48c1-9434-b591f0b3cfb7';
const AUTHORITY = 'https://login.microsoftonline.com/fa7b1b5a-7b34-4387-94ae-d2c178decee1';

let config;

async function getConfig() {
  if (!config) {
    const adminServerURL = 'https://admin.hlx3.page';
    const admin = {
      api: {
        preview: {
          baseURI: `${adminServerURL}/preview`,
        },
        status: {
          baseURI: `${adminServerURL}/status`,
        },
      },
    };

    // let res = await fetch('/');
    // const key = res.headers.get('surrogate-key');
    // if (key) {
    //   const split = key.substring(0, key.indexOf(' ')).split('--');
    //   if (split && split.length === 3) {
    //     [admin.ref, admin.repo, admin.owner] = split;
    //   }
    // }

    const res = await fetch(BULKOPERATIONS_CONFIG);
    if (!res.ok) {
      throw new Error('Config not found!');
    }

    const json = await res.json();
    const sp = json.sp.data[0];
    // reshape object for easy access
    config = {
      admin,
      sp,
    };

    const graphURL = 'https://graph.microsoft.com/v1.0';

    config.sp = {
      ...config.sp,
      clientApp: {
        auth: {
          clientId: config.sp.clientId,
          authority: config.sp.authority,
        },
      },
      login: {
        redirectUri: '/tools/bulk/spauth.html',
      },
      api: {
        url: graphURL,
        file: {
          get: {
            baseURI: `${config.sp.site}/drive/root:${config.sp.rootFolders}`,
          },
          download: {
            baseURI: `${config.sp.site}/drive/items`,
          },
          upload: {
            baseURI: `${config.sp.site}/drive/root:${config.sp.rootFolders}`,
            method: 'PUT',
          },
          createUploadSession: {
            baseURI: `${config.sp.site}/drive/root:${config.sp.rootFolders}`,
            method: 'POST',
            payload: {
              '@microsoft.graph.conflictBehavior': 'replace',
            },
          },
        },
        directory: {
          create: {
            baseURI: `${config.sp.site}/drive/root:${config.sp.rootFolders}`,
            method: 'PATCH',
            payload: {
              folder: {},
            },
          },
        },
        batch: {
          uri: `${graphURL}/$batch`,
        },
      },
    };
  }

  return config;
}

export {
  // eslint-disable-next-line import/prefer-default-export
  getConfig,
};
