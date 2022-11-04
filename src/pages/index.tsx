import { useState } from 'react';
import Image from 'next/image';
import appPreviewImg from '../assets/aplicacao-trilha-ignite.png';
import logo from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/avatares.png'
import iconCheck from '../assets/icon-check.svg'
import { api } from '../lib/axios';
import { FormEvent } from 'react';
import { GetStaticProps } from 'next';

interface HomeProps {
  poolCount: number;
  guessCount: number;
  usersCount: number;
}



export default function Home(props: HomeProps) {
  const [ poolTitle, setPoolTitle ] = useState('');

  async function createPool(event: FormEvent){
    event.preventDefault();
    if(poolTitle.length > 3){
      try{
        const response = await api.post('pools', {
          title: poolTitle
        });

        const { code } = response.data;
        await navigator.clipboard.writeText(code);
        alert('Bolão criado com sucesso, o texto foi copiado para a área de transferência!');
        setPoolTitle('');
      }catch(err){
        console.log(err);
        alert('Falha ao criar o bolão, tente novamente');
      }
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid gap-28 grid-cols-2 items-center">
      <main>

        <Image
          src={logo}
          alt="Logo" 
        />

        <h1 className="mt-14 text-white text-5xl font-bold font-leading leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image
            src={usersAvatarExampleImg}
            alt="Exemplos de avatar" 
          />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input 
            type="text" 
            required placeholder="Qual o nome do seu bolão?" 
            className="flex-1 px-6 py-4 text-gray-100 rounded bg-gray-800 border-gray-600 text-sm"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button 
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-sm uppercase hover:bg-yellow-700"
          > 
            Criar meu bolão 
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt=""/>
            <div className="flex flex-col">
              <span className="font-bold font-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"/>
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt=""/>
            <div className="flex flex-col">
              <span className="font-bold font-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image 
        src={appPreviewImg} 
        alt="Dois celulares exibindo a previa da aplicação móvel"
        quality={100}
      />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count
    },
    revalidate: 600
  }
}