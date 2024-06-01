import { Button, Input, Checkbox, message } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import "./App.css"
import { useCallback, useMemo, useState } from "react"

interface TodoListItemType {
  /** name */
  name: string
  /** todo status */
  status: boolean
}

function App() {
  const [todoName, setTodoName] = useState<string>("")
  const [todoList, setTodoList] = useState<TodoListItemType[]>([
    {
      name: "11111111",
      status: false,
    },
    {
      name: "2",
      status: false,
    },
  ])
  const [selectTodoName, setSelectTodoName] = useState<string>("")

  const handleClick = useCallback(
    (name: string) => {
      const copyTodoList: TodoListItemType[] = JSON.parse(
        JSON.stringify(todoList)
      )
      setSelectTodoName(name)
      const findIndex = copyTodoList.findIndex(
        (todoItem) => todoItem.name === name
      )
      if (findIndex === -1) return
      if (copyTodoList[findIndex].status) return
      copyTodoList[findIndex].status = true
      setTodoList(copyTodoList)
    },
    [todoList]
  )

  const handleCreate = useCallback(() => {
    if (!todoName) {
      message.warning("Please enter the todo item first")
      return
    }
    const findIndex = todoList.findIndex(
      (todoItem) => todoItem.name === todoName
    )
    if (findIndex !== -1) {
      message.warning("Exit same todo item")
      return
    }
    message.success({
      content: "Create todo item successfully !",
      duration: 0.5,
      onClose: () => {
        setTodoName("")
        setTodoList((prev) => {
          return [
            ...prev,
            {
              name: todoName,
              status: false,
            },
          ]
        })
      },
    })
  }, [todoList, todoName])

  const handleActiveAll = useCallback(() => {
    const copyTodoList: TodoListItemType[] = JSON.parse(
      JSON.stringify(todoList)
    )
    const activeList = copyTodoList.map((item) => {
      return {
        ...item,
        status: true,
      }
    })
    message.success({
      content: "Active all items successfully !",
      duration: 0.5,
      onClose: () => {
        setTodoList(activeList)
        setSelectTodoName("")
      },
    })
  }, [todoList])

  const handleClear = useCallback(() => {
    const copyTodoList: TodoListItemType[] = JSON.parse(
      JSON.stringify(todoList)
    )
    const findIndex = copyTodoList.findIndex(
      (todoItem) => todoItem.name === selectTodoName
    )

    if (findIndex === -1) return
    if (!copyTodoList[findIndex].status) return
    copyTodoList[findIndex].status = false
    message.success({
      content: `Clear ${selectTodoName} item successfully !`,
      duration: 0.5,
      onClose: () => {
        setTodoList(copyTodoList)
        setSelectTodoName("")
      },
    })
  }, [selectTodoName, todoList])

  const handleClearAll = useCallback(() => {
    const copyTodoList: TodoListItemType[] = JSON.parse(
      JSON.stringify(todoList)
    )
    const inactiveList = copyTodoList.map((item) => {
      return {
        ...item,
        status: false,
      }
    })
    message.success({
      content: "Clear all items successfully !",
      duration: 0.5,
      onClose: () => {
        setTodoList(inactiveList)
        setSelectTodoName("")
      },
    })
  }, [todoList])

  const undo = useMemo(() => {
    const filterItems = todoList.filter((todoItem) => !todoItem.status)
    return filterItems.length
  }, [todoList])

  const disabledActiveAll = useMemo(() => {
    const filterItems = todoList.filter((todoItem) => todoItem.status)
    return filterItems.length === todoList.length
  }, [todoList])

  const disabledClear = useMemo(() => {
    const findIndex = todoList.findIndex(
      (todoItem) => todoItem.name === selectTodoName
    )
    return !selectTodoName || !todoList[findIndex].status
  }, [selectTodoName, todoList])

  const disabledClearAll = useMemo(() => {
    const filterItems = todoList.filter((todoItem) => !todoItem.status)
    return filterItems.length === todoList.length
  }, [todoList])

  return (
    <div className="App">
      <div className="container">
        <div className="title">TODO</div>
        <div className="create">
          <Input
            placeholder="Create a new todo..."
            value={todoName}
            maxLength={10}
            onChange={(e) => {
              setTodoName(e.target.value)
            }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="createBtn"
            onClick={handleCreate}
          >
            Create
          </Button>
        </div>
        <div className="tips">
          Tip:
          <div className="tipsContent">
            Click on the list item to mark it as completed,
            <br />
            After selection,the list item will change background.
          </div>
        </div>
        <div className="list">
          {todoList.map((item) => {
            return (
              <div
                className="listItem"
                key={item.name}
                onClick={() => handleClick(item.name)}
                style={{
                  background:
                    item.name === selectTodoName ? "#f4f5fe" : "unset",
                }}
              >
                <Checkbox checked={item.status} />

                <div
                  className="listItemName"
                  style={{
                    color: item.status ? "rgba(36,47,101,0.6)" : "#242f65",
                    textDecoration: item.status ? "line-through" : "unset",
                  }}
                >
                  {item.name}
                </div>
              </div>
            )
          })}
          <div className="listTotal">
            <div className="totalItem">{undo} items incomplete</div>
            <div className="totalItem" onClick={handleActiveAll}>
              <Button type="link" disabled={disabledActiveAll}>
                All Active Completed
              </Button>
            </div>
            <div className="totalItem" onClick={handleClear}>
              <Button type="link" disabled={disabledClear}>
                Clear Completed
              </Button>
            </div>
            <div className="totalItem" onClick={handleClearAll}>
              <Button type="link" disabled={disabledClearAll}>
                Clear All Completed
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
