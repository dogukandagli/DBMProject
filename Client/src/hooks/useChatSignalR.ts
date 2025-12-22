import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../app/store/hooks";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { apiUrl } from "../shared/api/ApiClient";
import { updateConversationDetailLoanContext } from "../features/chats/store/ConversationStore";

export const useChatSignalR = (conversationId: string | null) => {
  const dispatch = useAppDispatch();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const activeConversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${apiUrl}hubs/chat`, {
        // accessTokenFactory: () => localStorage.getItem("token") || ""
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
    return () => {
      newConnection.stop();
      setIsConnected(false);
    };
  }, []);

  useEffect(() => {
    if (connection && connection.state === HubConnectionState.Disconnected) {
      connection.off("ReceiveLoanStateUpdate"); // Eski dinleyici varsa temizle (Duplicate önler)

      connection.on(
        "ReceiveLoanStateUpdate",
        (conservationId: string, loanContextDto: any) => {
          console.log(
            "🔥 SİNYAL GELDİ: LoanContext Güncellendi",
            loanContextDto
          );

          dispatch(
            updateConversationDetailLoanContext({
              conversationId: conservationId,
              newContext: loanContextDto,
            })
          );
        }
      );
      connection
        .start()
        .then(() => {
          console.log("🟢 ChatHub Bağlantısı BAŞARILI!");
          setIsConnected(true);
        })
        .catch((err) => console.error("🔴 ChatHub'a bağlanılamadı:", err));
    }
  }, [connection, dispatch]);

  useEffect(() => {
    if (connection && isConnected && conversationId) {
      if (
        activeConversationIdRef.current &&
        activeConversationIdRef.current !== conversationId
      ) {
        connection
          .invoke("LeaveConversation", activeConversationIdRef.current)
          .catch((err) => console.error("Leave hatası:", err));
      }
      connection
        .invoke("JoinConversation", conversationId)
        .then(() => {
          console.log(`✅ Odaya Girildi: ${conversationId}`);
          activeConversationIdRef.current = conversationId;
        })
        .catch((err) => console.error("❌ Odaya girilemedi:", err));
    }
  }, [connection, isConnected, conversationId]);
};
