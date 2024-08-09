import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://todo-server-2-pz5c.onrender.com';

type ScreenWidthType = number;

type AllToDosType = {
  todo: string;
  completed: boolean;
  id: string;
};

function App() {
  const [screenWidth, setScreenWidth] = useState<ScreenWidthType>(window.innerWidth);
  const [darkMode, setDarkMode] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [filteredTodos, setFilteredTodoes] = useState<AllToDosType[]>([]);
  const [filter] = useState('all');

  const changeMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);





  const getAllTodos = async () => {
    const res = await axios.get(`${BASE_URL}/todo`);
    const formattedData = res.data.map((el: any) => ({
      ...el,
      id: el._id,
    }));
    setFilteredTodoes(formattedData);
  };

  useEffect(() => {
    getAllTodos();
  }, []);





  const getFilteredTodoes = async (filterKeyword: string) => {
    const res = await axios.get(`${BASE_URL}/todo`, { params: {filterKeyword} })
    const formatedData = res.data.map((el: any) => (
      {
        ...el,
        id: el._id,
      }
    ))
    setFilteredTodoes(formatedData)
  }

  useEffect(() => {
    getFilteredTodoes(filter);
  }, [filter]);




  const createTodo = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/todo`, {
        todo: newTodo,
        completed: false,
      });
      if (res.status === 200) {
        setNewTodo('');
        getAllTodos();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/todo/${id}`);
      if (res.status === 200) {
        getAllTodos();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleCompleted = async (id: string, currentStatus: boolean) => {
    try {
      const res = await axios.put(`${BASE_URL}/todo/${id}`, { completed: !currentStatus });
      if (res.status === 200) {
        getAllTodos();
      }
    } catch (err) {
      console.log(err);
    }
  };


  const clearCompleted = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/todo`);
      if (res.status === 200) {
        getAllTodos();
      }
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <section className="App flex justify-center h-screen dark:bg-[#25273D] dark:duration-300">
      {screenWidth > 374 ? (
        <div>
          <img src="/assets/bg-desktop-img.png" alt="" />
        </div>
      ) : (
        <div>
          <img src="/assets/bg-mobile-img.jpg" alt="" />
        </div>
      )}

      <section className="container w-[87.2%] flex flex-col item-center justify-center absolute top-10 mx-6 md:w-[540px] md:top-[70px]">
        <div className="header w-full flex items-center justify-between mb-10 cursor-pointer">
          <img src={screenWidth > 374 ? "/assets/todo-logo-desktop.svg" : "/assets/todo-logo-mobile.svg"} alt="" />
          <img
            style={{
              transform: `rotate(${!darkMode ? '360deg' : '0deg'})`,
              transition: 'transform 0.5s ease',
            }}
            onClick={changeMode}
            src={darkMode ? "/assets/moon-desktop.svg" : "/assets/sun-desktop.svg"}
            alt=""
          />
        </div>

        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.currentTarget.value)}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await createTodo();
            }
          }}
          className="border rounded-md pl-5 py-3.5 border-none overflow-hidden shadow-lg outline-none mb-4 md:mb-6 md:text-lg md:py-5 dark:border-b dark:bg-[#393A4B] dark:shadow-none dark:duration-300 dark:text-[#C8CBE7]"
          type="text"
          placeholder="Create a new todo…"
        />
        <article className="taskwrapper w-full rounded-md bg-white shadow-lg mb-4 dark:bg-[#393A4B] dark:duration-300">
          {filteredTodos.map((el) => (
            <div key={el.id} className="item w-full flex flex-row items-center justify-between border-b border-[#E3E4F1] py-4 px-5 md:py-[19px] dark:border-[#C8CBE7]">
              <div onClick={async () => await toggleCompleted(el.id, el.completed)}>
                {el.completed === true ? (
                  <img
                    src='/assets/check-icon.png'
                    alt=""
                    className="w-[20px] h-[20px] rounded-full border md:w-[24px] md:h-[24px] dark:border dark:border-[#C8CBE7]"
                  />
                ) : (
                  <div
                    className="w-[20px] h-[20px] rounded-full border border-[#E3E4F1] md:w-[24px] md:h-[24px] dark:border dark:border-[#C8CBE7]"></div>
                )}
              </div>
              <p className={`text text-left ml-3 w-full text-xs font-normal ${el.completed ? 'line-through' : ''} text-[#494C6B] md:text-lg md:tracking-[-0.25px] dark:text-[#C8CBE7]`}>
                {el.todo}
              </p>
              <img
                onClick={async () => {
                  await deleteTodo(el.id);
                }}
                src={screenWidth > 374 ? '/assets/del-desktop-icon.svg' : '/assets/del-mobile-icon.svg'}
                alt=""
                className="w-[18px] h-[18px]"
              />
            </div>
          ))}

          <div className="footer-desktop w-full flex flex-row items-center justify-between rounded-b-md border-b border-[#E3E4F1] px-5 pt-4 pb-[22px] shadow-md md:py-4 dark:shadow-none dark:bg-[#393A4B] dark:duration-300">
            <button className="text-xs font-normal text-[#9495A5] tracking-[-0.17px] md:text-sm md:tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]">{filteredTodos.length} items left</button>
            {screenWidth > 375 && (
              <div className="item flex flex-row items-center justify-center gap-[19px] border-[#E3E4F1]">
                <button
                  onClick={() => getFilteredTodoes('all')}
                  className={`text-sm font-bold ${filter === 'all' ? 'text-[#3A7CFD]' : 'text-[#9495A5]'} tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]`}>All</button>
                <button
                  onClick={() => getFilteredTodoes('active')}
                  className={`text-sm font-bold ${filter === 'active' ? 'text-[#3A7CFD]' : 'text-[#9495A5]'} tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]`}>Active</button>
                <button
                  onClick={() => getFilteredTodoes('completed')}
                  className={`text-sm font-bold ${filter === 'completed' ? 'text-[#3A7CFD]' : 'text-[#9495A5]'} tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]`}>Completed</button>
              </div>
            )}
            <button
              onClick={() => clearCompleted()}
              className="text-xs font-normal text-[#9495A5] tracking-[-0.17px] md:text-sm md:tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]">Clear Completed</button>
          </div>
        </article>

        {screenWidth < 375 && (
          <div className="footer-mobile w-full flex flex-row items-center justify-center gap-[19px] rounded-md shadow-lg border-b border-[#E3E4F1] px-4 py-4 bg-white dark:border-b dark:border-[#C8CBE7] dark:bg-[#393A4B] dark:duration-300">
            <button
              onClick={() => getFilteredTodoes('all')}
              className={`text-sm font-bold ${filter === 'all' ? 'text-[#3A7CFD]' : 'text-[#9495A5]'} tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]`}>All</button>
            <button
              onClick={() => getFilteredTodoes('active')}
              className={`text-sm font-bold ${filter === 'active' ? 'text-[#3A7CFD]' : 'text-[#9495A5]'} tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]`}>Active</button>
            <button
              onClick={() => getFilteredTodoes('completed')}
              className={`text-sm font-bold ${filter === 'completed' ? 'text-[#3A7CFD]' : 'text-[#9495A5]'} tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]`}>Completed</button>
          </div>
        )}
      </section>
    </section>
  );
}

export default App;
