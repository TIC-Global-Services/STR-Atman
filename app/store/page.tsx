import ComingSoon from "@/components/reuseable/ComingSoon";
import ContourBackground from "@/components/reuseable/ContourBackground";

const page = () => {
  return (
    <div>
      <ContourBackground
        background="#ffffff"
        lineColor="#7a825c"
        resolution={10}
        levels={50}
      >
        <ComingSoon />
      </ContourBackground>
    </div>
  );
};

export default page;
