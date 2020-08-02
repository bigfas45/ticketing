import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header'

const AppComponent = ({ Component, pageProps, currentuser }) => {
    return(
    <div>
         <Header currentuser={currentuser}></Header>
         <div className="container"> 
             <Component currentuser={currentuser} {...pageProps} />
        </div>
    </div>);
};

AppComponent.getInitialProps = async appContext => {
    const client = buildClient(appContext.ctx);
    const {
        data
    }
    = await client.get('/api/users/currentuser');

    let pageProps = {};
    if(appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentuser);
    }

    
    return {
        pageProps,
        ...data
    }
};

export default AppComponent;
