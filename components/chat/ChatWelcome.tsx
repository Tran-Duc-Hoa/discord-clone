interface Props {
  type: 'channel' | 'conversation';
  name: string;
}

const ChatWelcome = ({ type, name }: Props) => {
  return <div>ChatWelcome</div>;
};

export default ChatWelcome;
