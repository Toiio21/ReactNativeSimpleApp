import React, {useState, useContext} from 'react'
import {View, StyleSheet, Dimensions } from 'react-native'
import { FontAwesome, AntDesign } from '@expo/vector-icons'

import { EditModal } from '../components/EditModal';
import { AppCard } from '../components/ui/AppCard';
import {AppTextBold} from '../components/ui/AppTextBold'
import {AppButton} from '../components/ui/AppButton'

import {THEME} from '../theme'
import { TodoContext } from '../context/todo/TodoContext';
import { ScreenContext } from '../context/screen/ScreenContext';

export const TodoScreen = () => {
  const {todos, updateTodo, removeTodo} = useContext(TodoContext)
  const {todoId, changeScreen} = useContext(ScreenContext)
  const [modal, setModal] = useState(false)

  const todo = todos.find(t => t.id === todoId)

  const saveHandler = async title => {
    await updateTodo(todo.id, title)
    setModal(false)
  }

  return (
    <View>
      <EditModal
        value={todo.title}
        visible={modal}
        onCancel={() => setModal(false)}
        onSave={saveHandler}
      />
      <AppCard style={styles.card}>
        <AppTextBold style={styles.title}>{todo.title}</AppTextBold>
        <AppButton onPress={() => setModal(true)}>
          <FontAwesome name='edit' size={20} />
        </AppButton>
      </AppCard>

      <View style={styles.buttons}>
        <View style={styles.button}>
          <AppButton onPress={() => changeScreen(null)} color={THEME.GREY_COLOR} >
            <AntDesign name='back' size={20} color='#fff' />
          </AppButton>
        </View>
        <View style={styles.button}>
          <AppButton
            color={THEME.DANGER_COLOR}
            onPress={() => removeTodo(todo.id)}
          >
            <FontAwesome name='remove' size={20} color='#fff' />
          </AppButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todoscreen: {},
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    marginBottom: 20,
    padding: 15
  },
  button: {
    width: Dimensions.get('window').width > 400? 180 : 130,
  },
  title: {
    fontSize: 20,
  },
})
