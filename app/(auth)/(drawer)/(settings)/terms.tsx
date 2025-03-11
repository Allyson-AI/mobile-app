import React, { useMemo, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { Text } from "~/components/ui/typography";
import * as Haptics from "expo-haptics";
import { IconChevronLeft } from "@tabler/icons-react-native";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { H4 } from "~/components/ui/typography";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Terms() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 justify-center">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 flex-col space-y-4 px-5 mt-2"
      >
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          className="flex-row items-center"
        >
          <IconChevronLeft size={24} color="#e4e4e7" />
          <Text className="text-2xl text-zinc-200 font-semibold my-2">
            Terms & Conditions
          </Text>
        </TouchableOpacity>
        <Text className="mb-2">
          These terms and conditions outline the rules and regulations for the
          use of Allyson, Inc.'s Website, located at https://allyson.ai.
        </Text>

        <Text className="mb-2">
          By accessing this website we assume you accept these terms and
          conditions. Do not continue to use Allyson if you do not agree to take
          all of the terms and conditions stated on this page.
        </Text>

        <Text className="mb-2">
          The following terminology applies to these Terms and Conditions,
          Privacy Statement and Disclaimer Notice and all Agreements: "Client",
          "You" and "Your" refers to you, the person log on this website and
          compliant to the Company's terms and conditions. "The Company",
          "Ourselves", "We", "Our" and "Us", refers to our Company. "Party",
          "Parties", or "Us", refers to both the Client and ourselves. All terms
          refer to the offer, acceptance and consideration of payment necessary
          to undertake the process of our assistance to the Client in the most
          appropriate manner for the express purpose of meeting the Client's
          needs in respect of provision of the Company's stated services, in
          accordance with and subject to, prevailing law of us. Any use of the
          above terminology or other words in the singular, plural,
          capitalization and/or he/she or they, are taken as interchangeable and
          therefore as referring to same.
        </Text>

        <H4>Cookies</H4>

        <Text className="mb-2">
          We employ the use of cookies. By accessing Allyson, you agreed to use
          cookies in agreement with the Allyson, Inc.'s Privacy Policy.{" "}
        </Text>

        <Text className="mb-2">
          Most interactive websites use cookies to let us retrieve the user's
          details for each visit. Cookies are used by our website to enable the
          functionality of certain areas to make it easier for people visiting
          our website. Some of our affiliate/advertising partners may also use
          cookies.
        </Text>

        <H4>License</H4>

        <Text className="mb-2">
          Unless otherwise stated, Allyson, Inc. and/or its licensors own the
          intellectual property rights for all material on Allyson. All
          intellectual property rights are reserved. You may access this from
          Allyson for your own personal use subjected to restrictions set in
          these terms and conditions.
        </Text>

        <Text className="mb-2">You must not:</Text>
        <View className="space-y-4">
          <Text>Republish material from Allyson</Text>
          <Text>Sell, rent or sub-license material from Allyson</Text>
          <Text>Reproduce, duplicate or copy material from Allyson</Text>
          <Text>Redistribute content from Allyson</Text>
        </View>

        <Text className="mb-2">
          This Agreement shall begin on the date hereof.
        </Text>

        <Text className="mb-2">
          Parts of this website offer an opportunity for users to post and
          exchange opinions and information in certain areas of the website.
          Allyson, Inc. does not filter, edit, publish or review Comments prior
          to their presence on the website. Comments do not reflect the views
          and opinions of Allyson, Inc.,its agents and/or affiliates. Comments
          reflect the views and opinions of the person who post their views and
          opinions. To the extent permitted by applicable laws, Allyson, Inc.
          shall not be liable for the Comments or for any liability, damages or
          expenses caused and/or suffered as a result of any use of and/or
          posting of and/or appearance of the Comments on this website.
        </Text>

        <Text className="mb-2">
          Allyson, Inc. reserves the right to monitor all Comments and to remove
          any Comments which can be considered inappropriate, offensive or
          causes breach of these Terms and Conditions.
        </Text>

        <Text className="mb-2">You warrant and represent that:</Text>

        <View className="space-y-4">
          <Text>
            You are entitled to post the Comments on our website and have all
            necessary licenses and consents to do so;
          </Text>
          <Text>
            The Comments do not invade any intellectual property right,
            including without limitation copyright, patent or trademark of any
            third party;
          </Text>
          <Text>
            The Comments do not contain any defamatory, libelous, offensive,
            indecent or otherwise unlawful material which is an invasion of
            privacy
          </Text>
          <Text>
            The Comments will not be used to solicit or promote business or
            custom or present commercial activities or unlawful activity.
          </Text>
        </View>

        <Text className="mb-2">
          You hereby grant Allyson, Inc. a non-exclusive license to use,
          reproduce, edit and authorize others to use, reproduce and edit any of
          your Comments in any and all forms, formats or media.
        </Text>

        <H4>Hyperlinking to our Content</H4>

        <Text className="mb-2">
          The following organizations may link to our Website without prior
          written approval:
        </Text>

        <View className="space-y-4">
          <Text>Government agencies;</Text>
          <Text>Search engines;</Text>
          <Text>News organizations;</Text>
          <Text>
            Online directory distributors may link to our Website in the same
            manner as they hyperlink to the Websites of other listed businesses;
            and
          </Text>
          <Text>
            System wide Accredited Businesses except soliciting non-profit
            organizations, charity shopping malls, and charity fundraising
            groups which may not hyperlink to our Web site.
          </Text>
        </View>

        <Text className="mb-2">
          These organizations may link to our home page, to publications or to
          other Website information so long as the link: (a) is not in any way
          deceptive; (b) does not falsely imply sponsorship, endorsement or
          approval of the linking party and its products and/or services; and
          (c) fits within the context of the linking party's site.
        </Text>

        <Text className="mb-2">
          We may consider and approve other link requests from the following
          types of organizations:
        </Text>

        <View className="space-y-4">
          <Text>
            commonly-known consumer and/or business information sources;
          </Text>
          <Text>dot.com community sites;</Text>
          <Text>associations or other groups representing charities;</Text>
          <Text>online directory distributors;</Text>
          <Text>internet portals;</Text>
          <Text>accounting, law and consulting firms; and</Text>
          <Text>educational institutions and trade associations.</Text>
        </View>

        <Text className="mb-2">
          We will approve link requests from these organizations if we decide
          that: (a) the link would not make us look unfavorably to ourselves or
          to our accredited businesses; (b) the organization does not have any
          negative records with us; (c) the benefit to us from the visibility of
          the hyperlink compensates the absence of Allyson, Inc.; and (d) the
          link is in the context of general resource information.
        </Text>

        <Text className="mb-2">
          These organizations may link to our home page so long as the link: (a)
          is not in any way deceptive; (b) does not falsely imply sponsorship,
          endorsement or approval of the linking party and its products or
          services; and (c) fits within the context of the linking party's site.
        </Text>

        <Text className="mb-2">
          If you are one of the organizations listed in paragraph 2 above and
          are interested in linking to our website, you must inform us by
          sending an e-mail to Allyson, Inc.. Please include your name, your
          organization name, contact information as well as the URL of your
          site, a list of any URLs from which you intend to link to our Website,
          and a list of the URLs on our site to which you would like to link.
          Wait 2-3 weeks for a response.
        </Text>

        <Text className="mb-2">
          Approved organizations may hyperlink to our Website as follows:
        </Text>

        <View className="space-y-4">
          <Text>By use of our corporate name; or</Text>
          <Text>
            By use of the uniform resource locator being linked to; or
          </Text>
          <Text>
            By use of any other description of our Website being linked to that
            makes sense within the context and format of content on the linking
            party's site.
          </Text>
        </View>

        <Text className="mb-2">
          No use of Allyson, Inc.'s logo or other artwork will be allowed for
          linking absent a trademark license agreement.
        </Text>

        <H4>iFrames</H4>

        <Text className="mb-2">
          Without prior approval and written permission, you may not create
          frames around our Webpages that alter in any way the visual
          presentation or appearance of our Website.
        </Text>

        <H4>Content Liability</H4>

        <Text className="mb-2">
          We shall not be hold responsible for any content that appears on your
          Website. You agree to protect and defend us against all claims that is
          rising on your Website. No link(s) should appear on any Website that
          may be interpreted as libelous, obscene or criminal, or which
          infringes, otherwise violates, or advocates the infringement or other
          violation of, any third party rights.
        </Text>

        <H4>Reservation of Rights</H4>

        <Text className="mb-2">
          We reserve the right to request that you remove all links or any
          particular link to our Website. You approve to immediately remove all
          links to our Website upon request. We also reserve the right to amen
          these terms and conditions and it's linking policy at any time. By
          continuously linking to our Website, you agree to be bound to and
          follow these linking terms and conditions.
        </Text>

        <H4>Removal of links from our website</H4>

        <Text className="mb-2">
          If you find any link on our Website that is offensive for any reason,
          you are free to contact and inform us any moment. We will consider
          requests to remove links but we are not obligated to or so or to
          respond to you directly.
        </Text>

        <Text className="mb-2">
          We do not ensure that the information on this website is correct, we
          do not warrant its completeness or accuracy; nor do we promise to
          ensure that the website remains available or that the material on the
          website is kept up to date.
        </Text>

        <H4>Disclaimer</H4>

        <Text className="mb-2">
          To the maximum extent permitted by applicable law, we exclude all
          representations, warranties and conditions relating to our website and
          the use of this website. Nothing in this disclaimer will:
        </Text>

        <View className="space-y-4 mb-2">
          <Text>
            limit or exclude our or your liability for death or personal injury;
          </Text>
          <Text>
            limit or exclude our or your liability for fraud or fraudulent
            misrepresentation;
          </Text>
          <Text>
            limit any of our or your liabilities in any way that is not
            permitted under applicable law; or
          </Text>
          <Text>
            exclude any of our or your liabilities that may not be excluded
            under applicable law.
          </Text>
        </View>

        <Text className="mb-10">
          The limitations and prohibitions of liability set in this Section and
          elsewhere in this disclaimer: (a) are subject to the preceding
          paragraph; and (b) govern all liabilities arising under the
          disclaimer, including liabilities arising in contract, in tort and for
          breach of statutory duty.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
