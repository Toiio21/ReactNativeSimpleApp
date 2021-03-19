import React, {useState, useEffect, useContext, useCallback } from 'react'
import {View, StyleSheet, FlatList, Image, Dimensions } from 'react-native'

import {AddTodo} from '../components/AddTodo'
import {Todo} from '../components/Todo'
import { AppButton } from '../components/ui/AppButton';
import { AppLoader } from '../components/ui/AppLoader';
import { AppText } from '../components/ui/AppText';
import { ScreenContext } from '../context/screen/ScreenContext';
import { TodoContext } from '../context/todo/TodoContext';
import { THEME } from '../theme';

export const MainScreen = () => {
  const { addTodo, todos, removeTodo, fetchTodos, loading, error } = useContext(TodoContext);
  const {changeScreen} = useContext(ScreenContext)
  const [deviceWidth, setDeviceWidth] = useState(Dimensions.get('window').width - (2 * THEME.PADDING_HORIZONTAL))

  const loadTodos = useCallback(async () => await fetchTodos(), [fetchTodos])

  useEffect(() => {
    loadTodos()
  }, [])

  useEffect(() => { //запускается 1 раз при инициализации компонента
    const update = () => {
      const widthMain = Dimensions.get('window').width - (2 * THEME.PADDING_HORIZONTAL)//расчет ширины
      setDeviceWidth(widthMain) //изменения текущего state
    }
    Dimensions.addEventListener('change', update)

    return () => {
      Dimensions.removeEventListener('change', update)
    }
  })

  if(loading) {
    return <AppLoader />
  }

  if (error) {
    return (
      <View style={styles.center}>
        <AppText style={styles.error}>{error}</AppText>
        <AppButton onPress={loadTodos} >Повторить</AppButton>
      </View>
    );
  }

  let content = (
    <View style={{ width: deviceWidth }} >
      <FlatList
        keyExtractor={(item) => item.id}
        data={todos}
        renderItem={({ item }) => (
          <Todo todo={item} onRemove={removeTodo} onOpen={changeScreen} />
        )}
      />
    </View>
  );

    if (todos.length === 0) {
      content = (
        <View style={styles.imgWrap}>
          <Image style={styles.image} source={require("../../assets/no-items.png")} />
        </View>
      );
    }

  return (
    <View style={styles.mainscreen}>
      <AddTodo onSubmit={addTodo} />

      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  imgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: 300
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    fontSize: 20,
    color: THEME.DANGER_COLOR
  }
})
