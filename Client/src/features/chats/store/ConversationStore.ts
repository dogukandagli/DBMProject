import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ConversationEntity } from "../../../entities/chat/ConversationEntity";
import type { RootState } from "../../../app/store/store";
import { ConvertsationApi } from "../api/ConversationApi";
import type {
  ConversationData,
  LoanContextDto,
} from "../../../entities/chat/ConversationData";

interface getConversationResponse {
  items: ConversationEntity[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

interface ConversationState {
  status: string;
  nextPage: number | null;
  hasMore: boolean;
  conservationDetail: ConversationData | null;
}

export const conversationAdapter = createEntityAdapter<
  ConversationEntity,
  string
>({
  selectId: (c) => c.id,
});

const initialState = conversationAdapter.getInitialState<ConversationState>({
  status: "idle",
  nextPage: 1,
  hasMore: true,
  conservationDetail: null,
});

export const getConversations = createAsyncThunk<
  getConversationResponse,
  void,
  { state: RootState }
>("conversation/getConversations", async (_, { getState }) => {
  const state = getState();
  const page = state.conversation.nextPage ?? 1;
  const response = await ConvertsationApi.getConversations(page);
  return response.data;
});

export const getConversationDetail = createAsyncThunk<ConversationData, string>(
  "conversation/getConversationDetail",
  async (data) => {
    const response = await ConvertsationApi.getConservation(data);
    return response.data;
  }
);

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    updateConversationDetailLoanContext: (
      state,
      action: PayloadAction<{
        conversationId: string;
        newContext: LoanContextDto;
      }>
    ) => {
      const { newContext } = action.payload;

      if (state.conservationDetail) {
        state.conservationDetail.loanContextDto = newContext;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.status = "pendingGetConversations";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.status = "idle";
        const { items, page, perPage, totalPages } = action.payload;
        if (page === 1) {
          conversationAdapter.setAll(state, items);
        } else {
          conversationAdapter.addMany(state, items);
        }
        const isLastPage = page >= totalPages || items.length < perPage;
        state.hasMore = !isLastPage;
        state.nextPage = isLastPage ? null : page + 1;
      })
      .addCase(getConversations.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(getConversationDetail.pending, (state) => {
        state.status = "pendingGetConversationDetail";
      })
      .addCase(getConversationDetail.fulfilled, (state, action) => {
        state.status = "idle";
        state.conservationDetail = action.payload;
      })
      .addCase(getConversationDetail.rejected, (state) => {
        state.status = "idle";
      });
  },
});

export const { selectAll: selectAllConversations } =
  conversationAdapter.getSelectors((state: RootState) => state.conversation);

export const { updateConversationDetailLoanContext } =
  conversationSlice.actions;
