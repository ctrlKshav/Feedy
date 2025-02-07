
// useEffect(() => {
//     const func = async () => {
//       if (useStore.getState().generating) return;
//       const updatedChats: ChatInterface[] = JSON.parse(
//         JSON.stringify(useStore.getState().chats)
//       );
//       updatedChats.forEach((chat) => {
//         console.log(chat.id)
//       });
//       const updatedMessages = updatedChats[currentChatIndex].messages;
//       console.log(updatedMessages)
      

//       const { data: threadsData, error: threadsError } = await supabase
//         .from('threads')
//         .select(`
//           id,
//           user_id,
//           messages (
//             id,
//             content,
//             created_at,
//             user_id,
//             admin_id,
//             role,
//             thread_id
//           )
//         `)
//         .eq('user_id', (await authData).userData.user?.id);
        
//         if(threadsData) {

//           console.log(updatedChats[currentChatIndex].id)
//           threadsData.forEach((thread) => {
//             if(thread.id === updatedChats[currentChatIndex].id) {
//               console.log("found")
//               console.log(thread.id)
//               const threadMessages = thread.messages || [];
          
//               // Sort messages by created_at timestamp
//               const sortedMessages = threadMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
              
//               const lastMessage = sortedMessages[sortedMessages.length - 1];

//               sortedMessages.map((message) => {
                
//                 updatedMessages.push({
//                   role: message.role,
//                   content: message.content,
//                   attachments: attachments.map((file) => ({
//                     name: file.name,
//                     type: file.type,
//                     size: file.size,
//                     url: URL.createObjectURL(file)
//                   }))
//                 });

//               });
//               }
//             });
//           }
        
        
//         // console.log("test5")
//         // console.log(updatedMessages)
//         setChats(updatedChats);
//         // handleSubmit(attachments[0], _content)

//     }
//     func()

//   },[currentChatIndex])
