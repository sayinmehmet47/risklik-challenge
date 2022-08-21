import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAuthorizationToken } from '../helpers/setAuthorizationToken';
import { Data } from '../shared/interfaces/data.interface';

interface Synonym extends Partial<Data> {
  user_id: number;
  project_id: number;
}

interface StatusKeys extends Partial<Data> {
  service_key: string;
}

interface ResultKeys extends Partial<Data> {
  product_key: string;
}

export const searchSynonyms = createAsyncThunk(
  'synonyms/searchSynonyms',
  async (synonym: Synonym, { rejectWithValue, dispatch }) => {
    setAuthorizationToken();
    try {
      const res = await axios.post(
        'https://test.risklick.ch/api/v1/riskanalysis/synonymsearch',
        synonym
      );
      dispatch(
        getStatus({
          user_id: synonym.user_id,
          project_id: synonym.project_id,
          service_key: res.data.service_key,
        })
      );
      return { ...res.data, raw: synonym };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getStatus = createAsyncThunk(
  'synonyms/getStatus',
  async ({ user_id, project_id, service_key }: StatusKeys, { dispatch }) => {
    const fetchStatus = async () => {
      const response = await axios.get(
        `https://test.risklick.ch/api/v1/riskanalysis/status/${user_id}/${project_id}/${service_key}`
      );
      if (response.data.state === 'IN_PROGRESS') {
        setTimeout(() => {
          dispatch(getStatus({ user_id, project_id, service_key }));
        }, 1000);
        return response.data;
      } else if (response.data.state === 'SUCCESSFUL') {
        const product_key = response.data.product_key;
        dispatch(getResults({ user_id, project_id, product_key }));
        return response.data;
      }
    };
    return await fetchStatus();
  }
);

export const getResults = createAsyncThunk(
  'synonyms/getResults',
  async (
    { user_id, project_id, product_key }: ResultKeys,
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `https://test.risklick.ch/api/v1/riskanalysis/download/${user_id}/${project_id}/${product_key}`
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const Synonyms = createSlice({
  name: 'cart',
  initialState: {
    service_key: '',
    status: {
      state: 'IN_PROGRESS',
      product_key: '',
    },
    results: [],
    error: false,
    errorMessages: '',
    loading: false,
    raw: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(searchSynonyms.fulfilled, (state: any, action: any) => {
        state.service_key = action.payload.service_key;
        state.raw = action.payload.raw;
      })
      .addCase(searchSynonyms.rejected, (state: any, action: any) => {
        state.error = true;
        state.errorMessages = action.payload.response.data.detail[0].msg;
      })
      .addCase(searchSynonyms.pending, (state, action) => {
        state.error = false;
        state.errorMessages = '';
      })

      .addCase(getStatus.fulfilled, (state: any, action: any) => {
        state.status = action.payload;
      })
      .addCase(getStatus.rejected, (state: any, action: any) => {
        state.error = true;
        state.errorMessages = action.payload.response.data.detail[0].msg;
      })
      .addCase(getStatus.pending, (state, action) => {
        state.error = false;
        state.errorMessages = '';
      })

      .addCase(getResults.rejected, (state: any, action: any) => {
        state.error = action.payload;
      })
      .addCase(getResults.fulfilled, (state: any, action: any) => {
        state.results = action.payload;
        state.error = '';
        state.errorMessages = '';
      })
      .addCase(getResults.pending, (state, action) => {
        state.error = false;
        state.errorMessages = '';
      });
  },
});

export default Synonyms.reducer;
