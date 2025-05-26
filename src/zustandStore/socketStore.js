import { create } from 'zustand';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3007');

const useSocketStore = create((set) => ({
    stream: null,
    myId: null,
    call: {},
    callAccepted: false,
    callEnded: false,

    setStream: (stream) => set({ stream }),

    videocall: () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                set({ stream: currentStream });
            })
            .catch(error => {
                console.error("getUserMedia error:", error);
                alert("Camera or microphone not found. Please check your devices or permissions.");
            });

    },

    listenToSocketMeEvent: () => {
        socket.on('me', (id) => set({ myId: id }));
    },

    listenToSocketCallUserEvent: () => {
        socket.on('callUser', ({ signal, from, name: callerName }) => {
            set({
                call: {
                    isReceivingCall: true,
                    from,
                    name: callerName,
                    signal,
                },
            });
        });
    },

    setCallAccepted: (status) => set({ callAccepted: status }),
    setCallEnded: (status) => set({ callEnded: status }),
}));

export default useSocketStore;
export { socket };
