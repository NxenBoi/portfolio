import Glass from "./Glass";
import Icon from "./Images/Icon";
import Stack from "./Stack";
import TintedGlass from "./TintedGlass";

const IconLinks = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Roblox_Studio_icon_2025.svg/960px-Roblox_Studio_icon_2025.svg.png",
  "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/8/0/3/803055db01520da334b1882da8a1146170b99b56.png",
  "https://images-eds-ssl.xboxlive.com/image?url=4rt9.lXDC4H_93laV1_eHHFT949fUipzkiFOBH3fAiZZUCdYojwUyX2aTonS1aIwMrx6NUIsHfUHSLzjGJFxxj7kCzMIlSC20SNjaJf9GmG15ocnF.zbBRgxMSlB7Ejh6FbgNzxLvZOoW7N3ML56fn3m5Z4MO.M8pYrCFVKIhqM-&format=source",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png",
  "https://rojo.space/img/logo.png",
  "https://avatars.githubusercontent.com/u/18133?s=200&v=4",
  "https://wally.run/_next/static/media/wally-logo.9d5dca56.svg",
];

function Skills() {
  return (
    <TintedGlass className="w-fit h-fit p-6 rounded-2xl">
      <Stack direction="column" justify="start" align="start" gap="6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
          {IconLinks.map((link) => (
            <Glass className="p-2 rounded-xl">
              <Icon src={link} className="w-12 h-fit"></Icon>
            </Glass>
          ))}
          <Glass className="p-2 rounded-xl opacity-50">...</Glass>
        </div>
        <hr className="w-full opacity-25"></hr>
      </Stack>
    </TintedGlass>
  );
}

export default Skills;
