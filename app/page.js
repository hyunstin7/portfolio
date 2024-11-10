'use client'


import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Matter from "matter-js";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";


export default function Home() {
  const boxRef = useRef(null);


  let [menuopen, setMenuOpen] = useState(false)
  let [mode, setMode] = useState('dark')
  let [day, setDay] = useState()
  let [date, setDate] = useState()
  let [hours, setHours] = useState()
  let [minutes, setMinutes] = useState()
  let [name, setName] = useState('')
  let [comment, setComment] = useState('')
  let [error, setError] = useState('')
  let [commentList, setCommentList] = useState([])
  const [aboutTop,setAboutTop] = useState(null)
  const [workTop,setWorkTop] = useState(null)
  const [commentTop,setCommentTop] = useState(null)
 

  
  const handleSubmit = async() => {
    try{
      const res =  await fetch('/api/comment',{
      
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({name, comment,})
      })
      const result = await res.json()
      if(res.ok){
        setName('')
        setComment('')
        setCommentList(result)
      }else{
        setError(result)
      }
    }catch(error){
      console.log(error)

    }
   
    }

    const getComment = async() => {
      try{
        const res =  await fetch('/api/comment')
        const result = await res.json()
        if(res.ok){
          setName('')
          setComment('')
          setCommentList(result)
        }else{
          setError(result)
        }
      }catch(error){
        console.log(error)
  
      }
     
      }

  useEffect(() => {
    
    document.body.className = mode;
  }, [mode]);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calcDay = () => dayNames[new Date().getDay()];
  const calcMin = () => {
    const min = new Date().getMinutes()
    if (min < 10) {
      return `0${min}`
    } else {
      return min
    }
  }

  useEffect(() => {
    
      if(window.innerWidth <= 768)
    document.querySelector('.header-slogan').innerHTML = 'jr.Dev.Hyunsun'

    setAboutTop(document.querySelector('.sec2').getBoundingClientRect().top + window.scrollY)
    setWorkTop(document.querySelector('.sec4').getBoundingClientRect().top + window.scrollY)
    setCommentTop(document.querySelector('.sec5').getBoundingClientRect().top + window.scrollY)
    
    getComment()
    document.querySelector('.s5-item1 .fake-bg').style.backgroundPosition = `${-document.querySelector('.s5-item1 .left').clientWidth - 15}px center`

    const resizing = () => {
      document.querySelector('.s5-item1 .fake-bg').style.backgroundPosition = `${-document.querySelector('.s5-item1 .left').clientWidth - 15}px center`
    }

    window.addEventListener('resize',resizing)

    const savedMode = localStorage.getItem('mode');
    if (savedMode) {
      setMode(savedMode);
    }
    const time = new Date()
    setDay(calcDay())
    setDate(time.getDate())
    setHours(time.getHours())
    setMinutes(calcMin())




    const intervalId = setInterval(() => {
      const time = new Date()
      setDay(calcDay())
      setDate(time.getDate())
      setHours(time.getHours())
      setMinutes(calcMin())
    }, 1000)




    gsap.registerPlugin(ScrollTrigger);


    
    const animateText = document.querySelectorAll(".animate-text");
    const animateTitle = document.querySelectorAll(".animate-title");

    animateText.forEach((p) => {
      const splitText = p.innerHTML.split("").map(char =>
        char === " " ? "&nbsp;" : `<span class="char">${char}</span>`
      ).join("");
      p.innerHTML = splitText;
    });


    animateText.forEach((p, i) => {
      const chars = p.querySelectorAll(".char");


      gsap.fromTo(chars,
        {
          opacity: 0,
          rotateX: 90,
          y: 15
        },
        {
          opacity: 1,
          rotateX: 0,
          y: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: p,
            start: "top 90%",
            end: "top 50%",
            scrub: 2,
          }
        });
    });
    

    animateTitle.forEach((h4, i) => {


      gsap.fromTo(h4,
        {
          opacity: 0,
          skewX: -50,
          x: 100
        },
        {
          opacity: 1,
          skewX: 0,
          x: 0,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: h4,
            start: "top 90%",
            end: "top 80%",
            scrub: true,
          }
        });
    });
    document.querySelectorAll('.i8-list').forEach((a, i) => {
      a.addEventListener('click', function () {
        document.querySelectorAll('.i8-list').forEach((b, i) => {
          b.style.background = '#fff'
        })
        document.querySelectorAll('.i8-slider').forEach((c, i) => {
          c.style.opacity = '0'
        })
        a.style.background = '#796767'
        document.querySelector(`.i8-slider${i + 1}`).style.opacity = 1
      })

    })


    const engine = Matter.Engine.create();
    const world = engine.world;

    const render = Matter.Render.create({
      element: boxRef.current,
      engine: engine,
      options: {
        width: boxRef.current.clientWidth,
        height: boxRef.current.clientHeight,
        wireframes: false,
        background: 'black'
      }
    });

    // 기존 벽 생성
    let walls = [
      Matter.Bodies.rectangle(0, boxRef.current.clientHeight / 2, 20, boxRef.current.clientHeight, { isStatic: true, friction: 1, restitution: 0, render: { strokeStyle: 'black', fillStyle: 'black' } }),
      Matter.Bodies.rectangle(boxRef.current.clientWidth, boxRef.current.clientHeight / 2, 20, boxRef.current.clientHeight, { isStatic: true, friction: 1, restitution: 0, render: { strokeStyle: 'black', fillStyle: 'black' } }),
      Matter.Bodies.rectangle(boxRef.current.clientWidth / 2, 0, boxRef.current.clientWidth, 20, { isStatic: true, friction: 1, restitution: 0, render: { strokeStyle: 'black', fillStyle: 'black' } }),
      Matter.Bodies.rectangle(boxRef.current.clientWidth / 2, boxRef.current.clientHeight, boxRef.current.clientWidth, 20, { isStatic: true, friction: 1, restitution: 0, render: { strokeStyle: 'black', fillStyle: 'black' } })
    ]
    // 월드에 벽 추가

    Matter.World.add(world, walls)

    walls.forEach(wall => Matter.World.add(world, wall));
    const reSizingWalls = (width, height) => {
      // 기존 벽 제거
      Matter.World.remove(world, walls);

      // 새로운 벽 생성
      walls = [
        Matter.Bodies.rectangle(0, height / 2, 20, height, { isStatic: true, friction: 1, restitution: 0, render: { strokeStyle: 'black', fillStyle: 'black' } }),
        Matter.Bodies.rectangle(width, height / 2, 20, height, { isStatic: true, friction: 1, restitution: 0, render: { strokeStyle: 'black', fillStyle: 'black' } }),
        Matter.Bodies.rectangle(width / 2, 0, width, 20, { isStatic: true, friction: 1, restitution: 0, render: { strokeStyle: 'black', fillStyle: 'black' } }),
        Matter.Bodies.rectangle(width / 2, height, width, 20, { isStatic: true, friction: 1, restitution: 0, render: { strokeStyle: 'black', fillStyle: 'black' } })
      ]

      // 월드에 새로운 벽 추가
      Matter.World.add(world, walls);
    };



    // 기존 박스 생성
    let boxes = [
      Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 3.5, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: '웹표준', render: { fillStyle: '#704040' } }),
      Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 3, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: '웹접근성', render: { fillStyle: '#1d79f9' } }),
      Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 4, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'UI/UX', render: { fillStyle: '#fe5f5f' } }),
      Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 3.5, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'NextJs', render: { fillStyle: '#ff8f1f' } }),
      Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 2.5, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'Development', render: { fillStyle: '#f33ca1' } }),
      Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 4, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'React', render: { fillStyle: '#23905b' } }),
      Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 4, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'HTML5', render: { fillStyle: '#bc16fe' } }),
      Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 4, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'CSS', render: { fillStyle: '#09a1c7' } }),
      Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 3.5, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'Jquery', render: { fillStyle: '#dc2f63' } }),
      Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 2.5, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'JavaScript(ES6)', render: { fillStyle: '#13ac0e' } }),
    ];

    // 월드에 박스들 추가
    Matter.World.add(world, boxes);

    const reSizingBoxes = (width, height) => {
      // 기존 박스 제거
      Matter.World.remove(world, boxes);

      // 새로운 박스 생성
      boxes = [
        Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 3.5, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: '웹표준', render: { fillStyle: '#704040' } }),
        Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 3, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: '웹접근성', render: { fillStyle: '#1d79f9' } }),
        Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 4, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'UI/UX', render: { fillStyle: '#fe5f5f' } }),
        Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 3.5, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'NextJs', render: { fillStyle: '#ff8f1f' } }),
        Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 2.5, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'Development', render: { fillStyle: '#f33ca1' } }),
        Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 4, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'React', render: { fillStyle: '#23905b' } }),
        Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 4, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'HTML5', render: { fillStyle: '#bc16fe' } }),
        Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 4, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'CSS', render: { fillStyle: '#09a1c7' } }),
        Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 3.5, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'Jquery', render: { fillStyle: '#dc2f63' } }),
        Matter.Bodies.rectangle(Math.random() * boxRef.current.clientWidth, Math.random() * boxRef.current.clientHeight, boxRef.current.clientWidth / 2.5, boxRef.current.clientHeight / 8, { restitution: 0.2, friction: 0.5, chamfer: { radius: window.innerWidth * 0.005 }, label: 'JavaScript(ES6)', render: { fillStyle: '#13ac0e' } }),
      ];



      // 월드에 새로운 박스 추가
      Matter.World.add(world, boxes);
    };



    const drawLabels = () => {
      const context = render.context


      boxes.forEach(box => {
        const { position, angle } = box;

        // 상태 저장
        context.save();

        // 각 물체의 위치로 이동 및 회전 적용
        context.translate(position.x, position.y);
        context.rotate(angle);

        // 글씨 크기와 스타일 설정
        context.font = `${boxRef.current.clientHeight / 20}px Arial`;
        context.fillStyle = "white";
        context.textAlign = "center";

        // 텍스트를 박스 중앙에 그리기
        context.fillText(box.label, 0, boxRef.current.clientHeight / 16 - boxRef.current.clientHeight / 20);

        // 상태 복구
        context.restore();

      });
    };

    // 마우스 제어를 위한 마우스 constraint 생성
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: Matter.Mouse.create(boxRef.current),
      constraint: {
        render: { visible: false },
        stiffness: 0.2,

      },
    });

    const limitVelocity = (box) => {
      const maxSpeed = 5; // 최대 속도 설정
      const speed = Math.sqrt(box.velocity.x ** 2 + box.velocity.y ** 2);

      if (speed > maxSpeed) {
        box.velocity.x = (box.velocity.x / speed) * maxSpeed;
        box.velocity.y = (box.velocity.y / speed) * maxSpeed;
      }
    };

    // 벽 충돌 체크 함수
    const checkWallCollision = (box) => {
      if (box.position.x < 20 || box.position.x > boxRef.current.clientWidth - 20 ||
        box.position.y < 20 || box.position.y > boxRef.current.clientHeight - 20) {

        // 박스를 벽 안으로 리셋
        Matter.Body.setPosition(box, {
          x: Math.max(20, Math.min(box.position.x, boxRef.current.clientWidth - 20)),
          y: Math.max(20, Math.min(box.position.y, boxRef.current.clientHeight - 20))
        });

        // 속도를 0으로 설정
        Matter.Body.setVelocity(box, { x: 0, y: 0 });
      }
    };

    // Matter.js 업데이트 루프에 추가
    Matter.Events.on(engine, 'beforeUpdate', () => {
      boxes.forEach(box => {
        limitVelocity(box);  // 속도 제한
        checkWallCollision(box); // 벽 충돌 체크
      });
    });

    // 리사이징 이벤트 리스너 추가
    const updateWalls = () => {

      const parentWidth = boxRef.current.clientWidth
      const parentHeight = boxRef.current.clientHeight
      // 캔버스 크기 리사이징
      render.canvas.width = parentWidth;
      render.canvas.height = parentHeight;
      // 리사이징된 벽 새로 생성
      reSizingWalls(parentWidth, parentHeight);
      // 리사이징된 박스 새로 생성
      reSizingBoxes(parentWidth, parentHeight);

    };

    // 리사이징 이벤트 리스너 추가
    window.addEventListener('resize', updateWalls);


    Matter.World.add(world, mouseConstraint);


    Matter.Events.on(render, 'afterRender', () => {
      drawLabels();
    });


    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);



    // 인트로 애니메이션 끝난후 스크롤 가능하게
    setTimeout(() => {
      document.querySelector('body').style.overflow = 'visible'
    }, 1500);

    return () => {
      window.removeEventListener('resize', updateWalls);
      clearInterval(intervalId);
    };


  }, []);



  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('mode', newMode); // 테마 설정을 로컬 스토리지에 저장
  };






  return (
    
    <div style={{overflow:'hidden'}}>

      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/gbb5clc.css" />
      </Head>


      <div className="intro">
        <h2 className="intro-txt">Hyun sun Choi</h2>
      </div>


      <header className="header">
        <div className="logo-wrap">
          <div className="logo" >
            <p className="infi-txt">Hello! World!</p>
            <p className="infi-txt">Hello! World!</p>
          </div>
        </div>
        <p className="header-slogan"><span>우직하게 목표를 향해 지내온 하루하루가 쌓여 결국에는 그 꿈에 도달할 것이라 믿습니다.<br></br></span>
          당신과 나를 위한, 모두가 만족하는 <span>최적의 솔루션을 제공하는 통찰력과</span> <br className="mo-br"></br>창의력 있는 개발자가 되겠습니다.</p>
        <div className="header-nav-btn" onClick={()=>{setMenuOpen(!menuopen)}}>+</div>
      </header>
      {
        menuopen ? <div className="fixed-menu">
        <p onClick={()=>{setMenuOpen(!menuopen);
          window.scrollTo({
            top : 0
          })
        }}>Home</p>
        <p onClick={()=>{setMenuOpen(!menuopen);
          window.scrollTo({
            top : aboutTop
          })
        }}>About me</p>
        <p onClick={()=>{setMenuOpen(!menuopen);
          window.scrollTo({
            top : workTop
          })
        }}>Work</p>
        <p onClick={()=>{setMenuOpen(!menuopen);
          window.scrollTo({
            top : commentTop
          })
        }}>Comment me</p>
        <div className="f-menu-btn" onClick={()=>{setMenuOpen(!menuopen)}}>
          <div className="line1 line"></div>
          <div className="line2 line"></div>
        </div>
      </div> : null
      }






      <section className="sec1" >
        <div className="s1-name-wrap">
          <h2 className="my-name">Hyun sun Choi</h2>
        </div>
        <img className="header s1-img" src="/img/sec1-bg.jpg"></img>
        <div className="section-underline" style={{ background: mode === 'dark' ? '#fff' : '#000' }}></div>
      </section>




      <section className="sec2">
        <div className="demon-wrap demon-wrap1">
          <span>01/</span>
          <div className="demon">
            <h4 className="animate-title">"안녕하세요, 프론트앤드 개발자로서의 꿈을 가진 최현선입니다."</h4>
            <p className="animate-text">직관적이고 클라이언트 입장을 생각하는 통찰력으로 디지털 시대의 웹 사이트를 통해 사용자에게 효과적인 레이아웃배치와
              접근정을 고려하는 특수성에 매료되었습니다.이를통해 사람들의 다양한 니즈에 맞춘 해결책을 제공할 수 있는
              프론트엔드 개발에 깊은 관심을 갖게 되었고,현재 이 꿈을 이루기 위해 노력하고 있습니다.</p>
          </div>
        </div>
        <div className="demon-wrap demon-wrap2" >
          <span>02/</span>
          <div className="demon">
            <h4 className="animate-title">"모두가 만족하는 해결책을 제시하는 일을 좋아합니다."</h4>
            <p className="animate-text">저는 상상한 무궁무진한 아이디어를 제가 배운 기술로 구현해가는 과정에서 큰 즐거움을 느낍니다.
              항상 새로운 시도를 두려워하지 않는 개발자로 성장해 나가겠습니다.
              제가 가장좋아하는 영어 격어인"smooth waters run deep"은 제 신념을 잘 표현합니다.
              거칠고 빠르게 흐르는 물보단 잔잔하지만 깊이 있게 흐르는 물처럼, 꾸준히 공부하며 나아갈 자신이 있습니다.
              성실하게 쌓은 지식을 바탕으로 회사에 실직적인 가치를 더할 수 있는 프론트엔드 개발자로 일하고 싶습니다.
            </p>
          </div>
        </div>
        <div className="section-underline" style={{ background: mode === 'dark' ? '#fff' : '#000' }}></div>
      </section>




      <section className="sec3">
        <h2 className="sub-title">About me</h2>
        <div className="about-container">
          <div ref={boxRef} className="item item1">
          </div>
          <div className="item item2">
            <h2>32+</h2>
            <p>age</p>
          </div>
          <div className="item item3">
            <h2>Project</h2>
            <p>6+</p>
          </div>
          <div className="item item4">
            <p>광주광역시 광산구 송정리+</p>
          </div>
          <div className="item item5">
            <div className="i5-img-wrap">
              <img src="/img/unlike.png"></img>
              <img src="/img/like.png"></img>
              <img src="/img/like.png"></img>
            </div>
          </div>
          <div className="item item6">
            <h4>Who am I?</h4>
          </div>
          <div className="item item7" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="list-box list-box1">
              <div>
                <div>
                  <h4 >Hyunstagram</h4>
                  
                </div>
                <button className="list-btn">+</button>
              </div>
            </div>
            <div className="list-box list-box2" >
              <div>
                <div>
                  <h4 >Jinwer The Liv</h4>
                  
                </div>
                <button className="list-btn">+</button>
              </div>
            </div>
            <div className="list-box list-box3">
              <div>
                <div>
                  <h4 >Witty</h4>
                  
                </div>
                <button className="list-btn">+</button>
              </div>
            </div>
            <div className="list-box list-box4">
              <div>
                <div>
                  <h4 >AD Communication</h4>
                  
                </div>
                <button className="list-btn">+</button>
              </div>
            </div>
          </div>
          <div className="item item8">
            <div className="i8-bg"></div>
            <div className="i8-slide-wrap">
              <div className="i8-slider i8-slider1"></div>
              <div className="i8-slider i8-slider2"></div>
              <div className="i8-slider i8-slider3"></div>
              <div className="i8-slider i8-slider4"></div>
              <div className="i8-slider i8-slider5"></div>
            </div>
            <div className="i8-card-list">
              <h2>My Photo</h2>
              <div className="i8-list-wrap">
                <div className="i8-list i8-list1">
                  <div className="i8-list-inner i8-list-inner1"></div>
                </div>
                <div className="i8-list i8-list2">
                  <div className="i8-list-inner i8-list-inner2"></div>
                </div>
                <div className="i8-list i8-list3">
                  <div className="i8-list-inner i8-list-inner3"></div>
                </div>
                <div className="i8-list i8-list4">
                  <div className="i8-list-inner i8-list-inner4"></div>
                </div>
                <div className="i8-list i8-list5">
                  <div className="i8-list-inner i8-list-inner5"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="item item9">
            <div className="i9-top">
              <div className="i9-date-wrap">
                <p>{day}</p>
                <p>{date}</p>
              </div>
              <div className='i9-git'>
                <a href="https://github.com/hyunstin7" target="_blank"><img src='/img/github.png'></img></a>
              </div>
            </div>
            <div className="i9-time-wrap">
              <span>{hours}</span> <span className="timeRoof">:</span> <span>{minutes}</span>
            </div>
          </div>
          <div className="item item10">
          <div className="logo" >
            <p className="infi-txt2">안녕하세요. 프론트엔드 개발자로서의 꿈을 가진 최현선입니다!</p>
            <p className="infi-txt2">안녕하세요. 프론트엔드 개발자로서의 꿈을 가진 최현선입니다!</p>
          </div>
          </div>
          <div className="item item11" onClick={() => { toggleMode() }}
            style={{ background: mode === 'dark' ? '#fff url(/img/statue-of-liberty.png) 40px 100% / contain no-repeat' : '#e0e0e0 80px 200%' }}>
            {
              mode === 'dark' ? null : <div className="i11-bg"></div>
            }
            {
              mode === 'dark' ? <img src="/img/sun.png" /> : <img src="/img/moon.png" />
            }
            {
              mode === 'dark' ? <h3 style={{ color: '#000' }}>Light<br />Mode</h3> : <h3 style={{ color: '#fff' }} >Dark<br />Mode</h3>
            }
          </div>

        </div>
        <div className="section-underline" style={{ background: mode === 'dark' ? '#fff' : '#000' }}></div>
      </section>





      <section className="sec4">
        <h2 className="sub-title">Work</h2>
        <div className="section-underline" style={{ background: mode === 'dark' ? '#fff' : '#000' }}></div>
        <div className="work-wrap">
          <div className="work-box">
            <a href="https://hyunstagram.vercel.app/login" target="_blank"><div className="work work1"></div></a>
            <div className="s4-demon">
              <div className="s4-demon-top">
                <div className="s4-demon-top-left">
                  <h2> Web & Mobile</h2>
                  <p>인스타그램 클론코딩</p>
                </div>
                <div className="s4-demon-top-right">
                  <p>제작기간 <span>2month</span></p>
                  <p>사용언어 <span>html,css,JavaScript,nextjs</span></p>
                  <p>데이터베이스 <span>mongoDB</span></p>
                </div>
              </div>
              <p>이 프로젝트는 인기 있는 소셜 미디어 플랫폼인 인스타그램을 클론하는 작업으로, 사용자 인증, 게시물 업로드, 댓글 및 좋아요 기능 등을 구현하여 소셜 미디어 앱의 기본적인 기능을 학습하고 개발 능력을 향상시키는것을 목표로 진행했습니다. 실제 서비스처럼 동작하는 웹 애플리케이션을 구현하면서 프론트앤드와 백앤드를 모두 다룰 수 있는 Next.js를 이용해 구축했습니다.
                </p>
            </div>
          </div>
          <div className="work-box">
            <a href="https://hyunstin7.github.io/jinwer/" target="_blank"><div className="work work2"></div></a>
            <div className="s4-demon">
            <div className="s4-demon-top">
                <div className="s4-demon-top-left">
                  <h2> Web & Mobile</h2>
                  <p>진월 더 리브 라포레</p>
                </div>
                <div className="s4-demon-top-right">
                  <p>제작기간 <span>1month</span></p>
                  <p>사용언어 <span>html,css,JavaScript</span></p>
                </div>
              </div>
              <p>고객이 쉽게 접근하고, 신뢰를 가질 수 있도록 분양사이트의 목적과 핵심 가치를 명확히 전달하는 것을 중점으로 두고 방문자가 홈페이지를 통해 얻을 수 있는 정보와 혜택을 간결하고 매력적으로 소개할 수 있도록 구현한 사이트입니다.
                </p>
            </div>
          </div>
          <div className="work-box">
            <a href="https://hyunstin7.github.io/wittiy/" target="_blank"><div className="work work3"></div></a>
            <div className="s4-demon">
            <div className="s4-demon-top">
                <div className="s4-demon-top-left">
                  <h2> Web & Mobile</h2>
                  <p>DATA기반 솔루션 홈페이지</p>
                </div>
                <div className="s4-demon-top-right">
                  <p>제작기간 <span>1month</span></p>
                  <p>사용언어 <span>html,css,JavaScript</span></p>
                </div>
              </div>
              <p>이 프로젝트는 DB(데이터베이스)를 활용한 모수 추출 기법을 통해 광고 효과를 극대화하는 회사의 핵심 가치를 온라인에서 직관적으로 전달하는 홈페이지를 구축하는 것이었습니다. 고객의 광고 캠페인 성과를 데이터 분석을 통해 최적화하고, 타겟팅 효율을 극대화하는 전략적 접근 방식을 제시하는 플랫폼입니다.
                </p>
            </div>
          </div>
          <div className="work-box">
            <a href="https://hyunstin7.github.io/adcommunicationTest/" target="_blank"><div className="work work4"></div></a>
            <div className="s4-demon">
            <div className="s4-demon-top">
                <div className="s4-demon-top-left">
                  <h2> Web & Mobile</h2>
                  <p>광고인커뮤니케이션</p>
                </div>
                <div className="s4-demon-top-right">
                  <p>제작기간 <span>1month</span></p>
                  <p>사용언어 <span>html,css,JavaScript</span></p>
                </div>
              </div>
              <p>이 프로젝트는 광고 회사의 브랜드 아이덴티티를 온라인 상에서 효과적으로 전달하고, 고객과의 신뢰를 쌓을 수 있는 플랫폼을 구축하는 것을 목표로 했습니다. 광고 회사의 핵심 가치인 창의성, 전략적 사고, 그리고 고객 중심의 솔루션을 반영하여, 방문자들에게 회사의 전문성과 차별화된 서비스를 직관적으로 전달할 수 있는 웹사이트를 개발했습니다.
                </p>
            </div>
          </div>
          <div className="work-box">
            <a href="https://hyunstin7.github.io/flower/" target="_blank"><div className="work work5"></div></a>
            <div className="s4-demon">
            <div className="s4-demon-top">
                <div className="s4-demon-top-left">
                  <h2> Web & Mobile</h2>
                  <p>꽃집 창업안내 페이지</p>
                </div>
                <div className="s4-demon-top-right">
                  <p>제작기간 <span>1month</span></p>
                  <p>사용언어 <span>html,css,JavaScript</span></p>
                </div>
              </div>
              <p>이 프로젝트는 꽃집 프랜차이즈 브랜드의 가치를 효과적으로 전달하고, 잠재적인 프랜차이즈 파트너들에게 브랜드의 비전, 강점, 지원 시스템 등을 소개하는 웹페이지로 목표는 브랜드의 전문성, 품질, 신뢰성을 강조하며, 프랜차이즈 파트너들이 쉽게 이해하고, 참여하고 싶은 욕구를 느낄 수 있도록 만든 웹사이트 입니다.
                </p>
            </div>
          </div>
          <div className="work-box">
            <a href="https://hyunstin7.github.io/slamdunkshop/" target="_blank"><div className="work work6"></div></a>
            <div className="s4-demon">
            <div className="s4-demon-top">
                <div className="s4-demon-top-left">
                  <h2> Web & Mobile</h2>
                  <p>슬램덩크 굿즈 팬 페이지</p>
                </div>
                <div className="s4-demon-top-right">
                  <p>제작기간 <span>1month</span></p>
                  <p>사용언어 <span>html,css,JavaScript</span></p>
                </div>
              </div>
              <p>이 프로젝트는 인기 애니메이션'슬램덩크'를 사랑하는 팬들을 타깃으로 다얀한 굿즈와 
                콜렉터 아이템을 소개하고, 최신소식과 이벤트 정보를 제공하며 브랜드의 특성을 반영한 독창적인 디자인을 구연한 사이트입니다.
                </p>
            </div>
          </div>
        </div>
      </section>


      <section className="sec5">
        <h2 className="sub-title">Comment me</h2>
            <div className="s5-grid-wrap">
              <div className="s5-item s5-item1" >
                <div className="left" ></div>
                <div className="right">
                  <div className="fake-bg"></div>
                </div>
              </div>
              <div className="s5-item s5-item2" >
                <div className="s5-i2-inner">
                  <span>To : </span>
                  <div><p>jr.Dev.hyunsun</p></div>
                </div>
                <div className="info-wrap">
                  <p>*Name</p>
                  <input type="text" onChange={(e)=>{setName(e.currentTarget.value);
                  setError('')
                  }} 
                  value={name}
                  />
                  <p>*Message</p>
                  <textarea type="text" maxLength={200} cols={7}
                  onChange={(e)=>{setComment(e.currentTarget.value);
                  setError('')
                  }}
                  value={comment}
                  />
                  {
                    error  == '' ? null : <p style={{color:'red'}}>{error}</p>
                  }
                </div>
                <div className="comment-list">
                  <p>Comment list</p>
                  {
                    commentList.length == 0 ? <p style={{textAlign:'center'}}>현재 댓글이 없습니다.</p> :
                    commentList.map((a,i)=>
                    <div key={i} style={{display:'flex'}} className="comment">
                      <h4 style={{marginRight:'1rem'}}>{a.name}</h4>
                      <p>{a.comment}</p>
                    </div>
                    )
                  }
                </div>
              </div>
              <div className="s5-item s5-item3" 
              style={{backgroundColor : mode == 'dark' ? '#f2f2f2' : '#000'}}
              >
                <p style={{color: mode == 'dark' ? '#000' : '#f2f2f2' }}>댓글달기</p>
                <img src={mode !== 'dark' ? '/img/send2.png' : '/img/send.png'} alt="" 
                style={{ height : '60%'}}
                onClick={()=>{handleSubmit()}}
                />
              </div>
              <div className="s5-item s5-item4"
              style={{backgroundColor : mode == 'dark' ? '#f2f2f2' : '#000'}}
              >
                  <h2 className="sub-title" style={{color: mode == 'dark' ? '#000' : '#f2f2f2' }}>Hyun Sun Choi</h2>
              </div>
            </div>
      </section>

    </div>
  );
}
