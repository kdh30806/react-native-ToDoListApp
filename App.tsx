import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TextProps,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {theme} from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.View`
  flex: 1;
  background-color: ${theme.bg};
  padding: 0px 20px;
`;

const Header = styled.View`
  flex-direction: row;
  margin-top: 100px;
  justify-content: space-between;
`;

const MenuBtn = styled.Text<{working: boolean}>`
  font-size: 44px;
  font-weight: 600;
  color: ${props => (props.working ? theme.grey : theme.white)};
`;

const Input = styled.TextInput`
  background-color: white;
  padding: 15px 20px;
  border-radius: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
`;

const ToDoView = styled.View`
  background-color: ${theme.grey};
  margin-bottom: 10px;
  padding: 20px 20px;
  border-radius: 15px;
`;
const ToDoText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const STORAGE_KEY = '@toDos';

const App = () => {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});
  const travle = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload: string) => setText(payload);
  const saveToDos = async toSave => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
  useEffect(() => {
    loadToDos();
  }, []);
  const addToDo = async () => {
    if (text === '') {
      return;
    }
    const newToDos = {...toDos, [Date.now()]: {text: text, working: working}};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText('');
  };
  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={work}>
          <MenuBtn working={!working}>Work</MenuBtn>
        </TouchableOpacity>
        <TouchableOpacity onPress={travle}>
          <MenuBtn working={working}>Travel</MenuBtn>
        </TouchableOpacity>
      </Header>
      <Input
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={
          working ? '할일을 작성해주세요.' : '어디로 가고 싶나요?'
        }></Input>
      <ScrollView>
        {Object.keys(toDos).map(key =>
          toDos[key].working === working ? (
            <ToDoView key={key}>
              <ToDoText>{toDos[key].text}</ToDoText>
            </ToDoView>
          ) : null,
        )}
      </ScrollView>
    </Container>
  );
};

export default App;
