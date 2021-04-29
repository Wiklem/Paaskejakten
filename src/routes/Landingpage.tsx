import React from "react";
import { Alert, Button, Card, Form } from "antd";
import { Input } from "antd";
import logo from "../assets/easter-egg.svg";
import { Link } from "react-router-dom";
import styles from "./Landingpage.module.css";

const Landingpage: React.FC = () => {
  const [code, setCode] = React.useState("");

  const message = (
    <div>
      <strong>Vil du bli med å teste en digital påskejakt?</strong>
      <p>
        Nå kan du enkelt lage tidenes påskejakt for store og små! Vi har laget
        en nettside for digital påskejakt hvor du enkelt legger inn selvvalgte
        spørsmål/svar og posisjon.
      </p>
      <p>
        Du velger vanskelighetsgrad ut i fra dine selvvalgte oppgaver og lengde
        på jakten.
      </p>

      <p>
        Når et spørsmål blir riktig besvart vil neste post dukke opp på kartet!
        🐥
      </p>

      <p>
        Logg inn med Facebook eller Google konto. Opprett ny jakt og legg til
        antall oppgaver du ønsker. Du kan velge mellom 1 svar eller
        flervalgsoppgave. Velg posisjon for hvert enkelt spørsmål 😁
      </p>

      <p>Når jakten er ferdig laget kan du dele lenken med jaktlaget ditt 😎</p>

      <p>
        Ta årets påskejakt til fots, sykkel, bil eller båt. Kun fantasien setter
        begrensinger 🐥🥳
      </p>
    </div>
  );
  return (
    <>
        <Card title={"Velkommen til påskejakten!!"}>
            Påsken er over for denne gang, men det er mulig å lage andre rebuser og skattejakter på <a href={"https://geohunt.no"}>GeoHunt.no</a>.
        </Card>
      {/*<Card title={"Velkommen til påskejakten!"}>*/}
      {/*  <Form layout="vertical">*/}
      {/*    <Form.Item*/}
      {/*      label="Påskejakt kode"*/}
      {/*      tooltip={*/}
      {/*        "Her skriver du inn koden du har fått for å starte påskejakten"*/}
      {/*      }*/}
      {/*    >*/}
      {/*      <Input*/}
      {/*        placeholder={"kode"}*/}
      {/*        onChange={(e) => setCode(e.target.value)}*/}
      {/*      />*/}
      {/*    </Form.Item>*/}
      {/*  </Form>*/}

      {/*  <Link to={"/jakt/" + code}>*/}
      {/*    <div*/}
      {/*      style={{*/}
      {/*        display: "flex",*/}
      {/*        justifyContent: "center",*/}
      {/*        marginTop: "10px",*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <Button key="submit" type="primary" disabled={!code}>*/}
      {/*        Start*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </Link>*/}
      {/*</Card>*/}
      <br />
      <Alert type={"info"} message={message} />
      <img className={styles.easterEgg} src={logo} alt="logo" />
    </>
  );
};

export default Landingpage;
