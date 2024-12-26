import { ApiClient } from '../client';

// API Clients for different compliance frameworks
export const apiClients = {
  gdpr: {
    euOpenData: new ApiClient({
      baseURL: 'https://data.europa.eu/api/hub/search/',
    }),
    edpb: new ApiClient({
      baseURL: 'https://edpb.europa.eu/our-work-tools/consistency-findings/',
    })
  },
  hipaa: {
    hhs: new ApiClient({
      baseURL: 'https://healthdata.gov/api/',
      apiKey: process.env.HHS_API_KEY
    }),
    npi: new ApiClient({
      baseURL: 'https://npiregistry.cms.hhs.gov/api/'
    })
  },
  osha: {
    enforcement: new ApiClient({
      baseURL: 'https://enforcedata.dol.gov/api/'
    })
  },
  ccpa: {
    caOpenData: new ApiClient({
      baseURL: 'https://data.ca.gov/api/'
    }),
    caAG: new ApiClient({
      baseURL: 'https://oag.ca.gov/api/',
      apiKey: process.env.CA_AG_API_KEY
    })
  },
  sox: {
    edgar: new ApiClient({
      baseURL: 'https://www.sec.gov/edgar/sec-api/'
    }),
    pcaob: new ApiClient({
      baseURL: 'https://pcaobus.org/api/'
    })
  }
};
