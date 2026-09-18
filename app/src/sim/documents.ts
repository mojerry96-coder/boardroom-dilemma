// Typeset in-world documents. Text from CONTENT_LOGIC_FINALIZATION.md sections 3, 4 and 19.7,
// and the DBA9101 Screen 0 context. Inline markers: **bold**, ==learner highlight==.

import { DOC_PHOTOS } from '../assets';

export type Block =
  | { t: 'h'; text: string }
  | { t: 'p'; text: string }
  | { t: 'meta'; rows: [string, string][] }
  | { t: 'list'; ordered?: boolean; items: string[] }
  | { t: 'quote'; text: string }
  | { t: 'table'; head: string[]; rows: string[][]; numeric?: number[] }
  | { t: 'sign'; lines: string[] }
  | { t: 'note'; text: string }
  | { t: 'headline'; text: string; standfirst?: string }
  | { t: 'photo'; src: string; alt: string; caption?: string };

export type DocKind = 'report' | 'memo' | 'audit' | 'news' | 'statement' | 'brief';

export interface DocDef {
  id: string;
  kind: DocKind;
  title: string;
  heading: string;
  classification?: string;
  masthead?: string;
  blocks: Block[];
  footer?: string;
  alt: string;
  /** Shown first when the document opens; the full text follows on request. */
  keyFacts?: string[];
  /** Printed on the photographed letterhead paper (PROPS.docPaper). */
  letterhead?: boolean;
}

export const DOCUMENTS = {
  brief: {
    id: 'brief',
    kind: 'brief',
    title: 'Your brief',
    heading: 'Company Secretariat: Brief for the Emergency Board Session',
    classification: 'CONFIDENTIAL',
    alt: 'The context brief for your role.',
    keyFacts: [
      "You advise DIN's Board as **Company Secretary and Strategic Advisor**.",
      'A contract worker died three weeks ago on a line running with a **bypassed safety interlock**.',
      'Internal audit has flagged **“facilitation payments”** through a logistics agent. UK headquarters says it was never told.',
      'A journalist is asking questions; the regulator knows but has not opened an inquiry. **The Board meets in 72 hours.**',
    ],
    blocks: [
      {
        t: 'p',
        text: 'You are the Company Secretary and Strategic Advisor to the Board of Delta Industrial Nigeria Ltd. (DIN), a Nigerian subsidiary of a UK-based multinational manufacturing group.',
      },
      {
        t: 'p',
        text: "Three weeks ago, a contract worker died in an accident at DIN's Ogun State facility, on a production line that had been running with a bypassed safety interlock, a cost-cutting measure introduced eight months earlier under pressure to hit group-wide margin targets.",
      },
      {
        t: 'p',
        text: 'Separately, an internal audit has flagged a pattern of “facilitation payments” made through a logistics agent to expedite customs clearance and local permits. Senior local management describes these payments as “how things get done here”, and UK headquarters says it was never formally told about them.',
      },
      { t: 'p', text: 'A journalist has begun asking questions. The regulator has not yet opened a formal inquiry, but is aware of the accident.' },
      { t: 'p', text: 'You have been asked to advise the Board before its emergency session in 72 hours.' },
      {
        t: 'p',
        text: '**Your task:** guide the Board toward a governance response that is ethically defensible, not just reputationally convenient, and be prepared to justify every recommendation you make.',
      },
    ],
  },

  incident: {
    id: 'incident',
    kind: 'report',
    title: 'Incident Report',
    heading: 'Preliminary Incident Report',
    classification: 'CONFIDENTIAL',
    alt: 'Preliminary incident report for the fatal incident on 1 June 2026.',
    keyFacts: [
      'A contract worker was fatally injured on **1 June 2026** at the DIN Ogun State Production Facility.',
      'The line’s safety interlock was under a **temporary bypass** that had run longer than normally allowed.',
      'The file refers to approval to keep producing, but **the full approval chain has not been verified**.',
    ],
    blocks: [
      {
        t: 'meta',
        rows: [
          ['Incident reference', 'DIN/HSSE/IR-060126'],
          ['Facility', 'DIN Ogun State Production Facility'],
          ['Date of incident', '1 June 2026'],
          ['Incident type', 'Fatal workplace incident'],
          ['Person affected', 'Contract worker'],
          ['Status', 'Preliminary, investigation open'],
        ],
      },
      { t: 'h', text: '1. Incident summary' },
      {
        t: 'p',
        text: 'At approximately 14:20 on 1 June 2026, a contract worker was fatally injured during an operating incident on a production line at the DIN Ogun State facility. Emergency response procedures were activated, the affected line was isolated, and the relevant internal functions were notified.',
      },
      {
        t: 'photo',
        src: DOC_PHOTOS.incident,
        alt: 'The affected roller-conveyor production line, stopped, with yellow-and-black hazard markings and a yellow warning stand on the factory floor.',
        caption: 'Figure 1. Affected production line after isolation, 1 June 2026. Photo: DIN HSSE.',
      },
      { t: 'h', text: '2. Equipment condition identified during initial review' },
      {
        t: 'p',
        text: 'The initial technical inspection confirmed that ==a safety interlock intended to stop the line automatically under specified unsafe conditions was not functioning in its normal protective mode at the time of the incident==.',
      },
      {
        t: 'p',
        text: 'The interlock had been placed under a temporary operating bypass. Records reviewed to date indicate that the bypass had remained in use beyond the period normally expected for a temporary deviation.',
      },
      { t: 'h', text: '3. Approval and control trail' },
      {
        t: 'p',
        text: 'The current incident file contains references to operational approval for continued production while the interlock remained bypassed. ==The complete approval chain has not yet been verified.==',
      },
      {
        t: 'p',
        text: 'The review team has requested all related maintenance records, operating-deviation approvals, supervisor logs, and management correspondence.',
      },
      { t: 'h', text: '4. Immediate actions taken' },
      {
        t: 'list',
        items: [
          'Production on the affected line suspended pending technical review.',
          'Relevant equipment isolated and secured.',
          'Contractor and family liaison process initiated.',
          'Internal HSSE investigation opened.',
          'Records relating to the interlock bypass placed under document hold.',
        ],
      },
      { t: 'h', text: '5. Open questions' },
      {
        t: 'list',
        items: [
          'When was the bypass first authorised?',
          'Who knew the interlock remained bypassed?',
          'Why was production allowed to continue?',
          'What earlier warnings or near-miss reports referred to the same protection system?',
          'Did commercial or production pressure influence the decision to keep the line running?',
        ],
      },
      { t: 'meta', rows: [['Prepared for', 'Board pre-review']] },
    ],
    footer: 'CONFIDENTIAL · NOT FOR EXTERNAL DISTRIBUTION',
  },

  nearMiss: {
    id: 'nearMiss',
    kind: 'report',
    title: 'Near-Miss Report',
    heading: 'Near-Miss Report',
    classification: 'INTERNAL USE ONLY',
    alt: 'Near-miss report dated 4 February 2026 for the same production line.',
    keyFacts: [
      'On **4 February 2026**, the same line did not stop when the interlock should have activated.',
      'The interlock was already under a **temporary bypass** pending maintenance.',
      'The report was closed locally, with **no record that the interlock was ever restored**.',
    ],
    blocks: [
      {
        t: 'meta',
        rows: [
          ['Reference', 'DIN/HSSE/NMR-020426'],
          ['Facility', 'DIN Ogun State Production Facility'],
          ['Date', '4 February 2026'],
          ['Classification', 'High-potential near miss'],
        ],
      },
      { t: 'h', text: '1. Event summary' },
      {
        t: 'p',
        text: 'During routine production, an abnormal operating condition developed on the same production line later involved in the 1 June fatal incident. No employee or contractor was injured.',
      },
      { t: 'p', text: '==The line did not stop automatically at the point the operator expected the safety interlock to activate.==' },
      { t: 'p', text: 'The operator initiated a manual stop and reported the event to the shift supervisor.' },
      { t: 'h', text: '2. Initial technical observation' },
      { t: 'p', text: 'Maintenance confirmed that the interlock was operating under a temporary bypass pending planned maintenance work.' },
      { t: 'p', text: 'The line was returned to service after local checks were completed.' },
      {
        t: 'photo',
        src: DOC_PHOTOS.nearMiss,
        alt: 'Close-up of the safety interlock on the line guard: the door switch is covered with grey duct tape, with a red lockout hasp and a maintenance tag hanging from it.',
        caption: 'Figure 1. Interlock on the same line during the 4 February inspection, under temporary bypass. Photo: DIN Maintenance.',
      },
      { t: 'h', text: '3. Recommended corrective actions' },
      {
        t: 'list',
        ordered: true,
        items: [
          'Restore the interlock to normal protective operation before continued routine production.',
          'Confirm the approval basis for the temporary bypass.',
          'Review whether production targets are affecting maintenance deferrals or operating-deviation decisions.',
          'Escalate any extension of the bypass beyond the planned maintenance window.',
        ],
      },
      { t: 'h', text: '4. Closure note recorded in the local file' },
      { t: 'quote', text: 'Continue monitoring pending scheduled maintenance. Production commitments remain critical. Escalate if operating conditions deteriorate.' },
      { t: 'h', text: '5. Status at closure' },
      {
        t: 'meta',
        rows: [
          ['Administrative status', 'Closed locally'],
          ['Technical restoration confirmed', '==No supporting record located in this file=='],
        ],
      },
    ],
    footer: 'INTERNAL USE ONLY',
  },

  payments: {
    id: 'payments',
    kind: 'audit',
    title: 'Payment Records',
    heading: 'Internal Audit Extract: Expediting Fee Payments',
    classification: 'CONFIDENTIAL · INTERNAL AUDIT',
    alt: 'Internal audit extract listing three expediting-fee payments to one logistics agent.',
    keyFacts: [
      '**Three payments** (₦4.8m, ₦5.25m and ₦6.1m) went to one agent, Crestfield Logistics, over about fourteen months.',
      'All were charged to the **“Expediting Fee”** budget line, and the files do not show where the money finally went.',
      'Local management called it **“how things get done here”**; UK headquarters says it was never formally told.',
    ],
    blocks: [
      {
        t: 'meta',
        rows: [
          ['Reference', 'DIN/IA/EF-062226'],
          ['Review period', 'April 2025 to May 2026'],
          ['Prepared by', 'Internal Audit'],
          ['Status', 'Escalation required'],
        ],
      },
      {
        t: 'table',
        head: ['Date', 'Payee', 'Budget line', 'Business description', 'Amount', 'Supporting documentation'],
        rows: [
          ['10 Apr 2025', 'Crestfield Logistics Services Ltd.', 'Expediting Fee', 'Customs clearance support', '₦4,800,000', 'Agent invoice only'],
          ['17 Nov 2025', 'Crestfield Logistics Services Ltd.', 'Expediting Fee', 'Local permit facilitation', '₦5,250,000', 'Agent invoice + approval email'],
          ['28 May 2026', 'Crestfield Logistics Services Ltd.', 'Expediting Fee', 'Priority clearance / local approvals', '₦6,100,000', 'Agent invoice only'],
        ],
        numeric: [4],
      },
      { t: 'h', text: 'Audit observations' },
      {
        t: 'list',
        ordered: true,
        items: [
          '==The same intermediary received three payments over approximately fourteen months.==',
          'The transactions were consistently charged to the **“Expediting Fee”** budget line.',
          'The supporting files do not identify the ultimate recipient of funds beyond the logistics agent.',
          'Business explanations refer to speeding up customs clearance and local permit processing.',
          'Local management described the payments during audit interviews as part of **“how things get done here.”**',
          '==UK headquarters states it was not formally advised== that the “Expediting Fee” budget line was being used for facilitation payments.',
        ],
      },
      { t: 'h', text: 'Audit conclusion' },
      {
        t: 'p',
        text: 'The pattern is not sufficient, by itself, to establish an unlawful payment. It is sufficient to require Board-level review of:',
      },
      {
        t: 'list',
        items: [
          'the purpose and destination of the payments;',
          'whether documentation standards were intentionally reduced;',
          'whether local practice had become normalised outside formal governance controls;',
          'whether reporting to group headquarters was adequate.',
        ],
      },
    ],
    footer: 'CONFIDENTIAL · INTERNAL AUDIT',
  },

  correspondence: {
    id: 'correspondence',
    kind: 'memo',
    title: 'Internal Correspondence',
    heading: 'Internal Correspondence',
    classification: 'CONFIDENTIAL',
    alt: 'Email from the Regional Director dated 15 May 2026.',
    keyFacts: [
      'Sent by the **Regional Director** on 15 May 2026 to the Managing, Operations and Finance Directors.',
      'It tells teams to use judgement on **“temporary operating deviations and minor expediting arrangements”**.',
      'Its key instruction: **“Just keep documentation light and focus on delivery.”**',
    ],
    blocks: [
      {
        t: 'meta',
        rows: [
          ['From', 'Regional Director'],
          ['To', 'Managing Director, Operations Director, Finance Director'],
          ['Date', '15 May 2026'],
          ['Subject', 'Local operating realities and escalation discipline'],
        ],
      },
      { t: 'p', text: 'Colleagues,' },
      {
        t: 'p',
        text: 'I know the teams are under pressure to protect output and keep local approvals moving. We also need to avoid turning every operational workaround into a group-level escalation.',
      },
      {
        t: 'p',
        text: '==I understand local realities.== Use judgement on temporary operating deviations and minor expediting arrangements where these can be managed within existing budgets and local authority.',
      },
      {
        t: 'p',
        text: 'Where an issue can be resolved locally, resolve it locally. Do not create unnecessary correspondence or escalation loops that slow the business down. ==Just keep documentation light and focus on delivery.==',
      },
      { t: 'p', text: 'Anything genuinely material, legally sensitive, or outside delegated authority should still come to me.' },
      { t: 'sign', lines: ['Regards,', '**Regional Director**'] },
    ],
    footer: 'CONFIDENTIAL',
  },

  news: {
    id: 'news',
    kind: 'news',
    title: 'News Clipping',
    heading: 'Questions Grow After Fatal Incident at Delta Industrial Nigeria Facility',
    masthead: 'The Ogun Business Review',
    alt: 'Newspaper clipping from The Ogun Business Review, 20 June 2026.',
    keyFacts: [
      'The Ogun Business Review reports the **worker’s death** at DIN’s Ogun State facility.',
      'Worker representatives say concerns about **maintenance delays and production pressure** were raised earlier.',
      'The regulator is aware but **has not opened a formal inquiry**. The payments have not been reported.',
    ],
    blocks: [
      {
        t: 'headline',
        text: 'Questions Grow After Fatal Incident at Delta Industrial Nigeria Facility',
        standfirst: 'Worker representatives ask whether earlier safety concerns were acted upon',
      },
      {
        t: 'photo',
        src: DOC_PHOTOS.news,
        alt: 'Black-and-white photograph of the facility entrance: a closed steel gate and guard house in a perimeter wall, with palm trees and factory structures behind.',
        caption: 'The DIN Ogun State Production Facility. Photo: The Ogun Business Review.',
      },
      {
        t: 'p',
        text: 'A contract worker died earlier this month following an incident at the Ogun State production facility operated by **Delta Industrial Nigeria Ltd. (DIN)**, the Nigerian subsidiary of a UK-based manufacturing group.',
      },
      { t: 'p', text: 'DIN has confirmed that an internal investigation is under way and says it is cooperating with the relevant authorities.' },
      {
        t: 'p',
        text: '==Worker representatives told The Ogun Business Review that employees had previously raised concerns about maintenance delays and production pressure at the facility.== DIN has not confirmed whether those concerns related directly to the equipment involved in the fatal incident.',
      },
      {
        t: 'p',
        text: 'A spokesperson for the regulator confirmed that the agency is aware of the fatality but ==has not opened a formal inquiry at this stage==.',
      },
      { t: 'p', text: 'DIN said in a short statement:' },
      { t: 'quote', text: 'We are reviewing the circumstances of the incident and will provide further information when the facts have been established.' },
      { t: 'p', text: 'The family of the deceased worker has asked the company for a full account of what happened and what will change as a result.' },
      { t: 'p', text: '**No allegation relating to facilitation payments or financial misconduct has been reported publicly at the time of publication.**' },
    ],
    footer: 'Saturday 20 June 2026 · Business',
  },

  supervisor: {
    id: 'supervisor',
    kind: 'statement',
    title: 'Supervisor Statement',
    heading: 'Signed Supervisor Statement',
    classification: 'CONFIDENTIAL',
    alt: 'Signed statement from Shift Supervisor Tunde Adebayo dated 23 June 2026.',
    keyFacts: [
      'Shift Supervisor **Tunde Adebayo** raised the bypass with the Regional Director after the February near miss.',
      'The Regional Director approved it **“temporarily”, in writing**, on 12 February 2026.',
      'The reply said: **“Understand local realities; keep documentation light.”** The decision was not the plant floor’s alone.',
    ],
    blocks: [
      {
        t: 'meta',
        rows: [
          ['Name', 'Tunde Adebayo'],
          ['Position', 'Shift Supervisor'],
          ['Department', 'Operations'],
          ['Date', '23 June 2026'],
        ],
      },
      {
        t: 'p',
        text: 'I confirm that the production-line interlock bypass was discussed before the fatal incident and was not treated only as a maintenance matter.',
      },
      {
        t: 'p',
        text: 'Following the February near miss, I raised concerns that the bypass had remained in place longer than expected. The issue was discussed with the Regional Director during an operating review.',
      },
      {
        t: 'p',
        text: 'My understanding from that discussion was that the bypass could remain **temporarily** while the business recovered output, provided the line was monitored and the matter was handled locally.',
      },
      {
        t: 'p',
        text: 'The Regional Director referred to the same approach used in previous operating discussions: that we should **“understand local realities”** and **“keep documentation light.”**',
      },
      {
        t: 'p',
        text: "The approval was also given in writing. When I submitted the request to extend the operating deviation on 12 February 2026, the Regional Director's reply read: ==“Approved, temporarily. Understand local realities; keep documentation light.”== A copy of that reply is attached to this statement.",
      },
      { t: 'p', text: '==I understood this as approval to continue the temporary arrangement while maintenance was deferred.==' },
      {
        t: 'p',
        text: 'I accept that I continued to supervise the line under that arrangement. I am providing this statement because ==the decision was not made by the plant floor alone.==',
      },
      { t: 'sign', lines: ['Signed: Tunde Adebayo', 'Shift Supervisor'] },
    ],
    footer: 'CONFIDENTIAL',
  },

  talkingPoints: {
    id: 'talkingPoints',
    kind: 'memo',
    title: "MD's Draft Talking Points",
    letterhead: true,
    heading: 'Draft: Talking Points for the Emergency Board Session',
    classification: 'CONFIDENTIAL · BOARD ONLY',
    alt: "The Managing Director's draft talking points, including the line “This is not who we are as a company.”",
    keyFacts: [
      'The **Managing Director’s draft** for the emergency Board session, dated 22 June.',
      'It includes the line: **“This is not who we are as a company.”**',
      'It treats the payments as a separate finance matter. **You are asked to confirm the framing.**',
    ],
    blocks: [
      {
        t: 'meta',
        rows: [
          ['Prepared by', 'Office of the Managing Director'],
          ['Date', '22 June 2026'],
        ],
      },
      {
        t: 'list',
        ordered: true,
        items: [
          'We are deeply saddened by the death of a contract colleague at our Ogun State facility on 1 June.',
          '==This is not who we are as a company.==',
          'Safety is and has always been our first priority. The affected line remains suspended pending technical review.',
          'We are cooperating with the relevant authorities and have opened an internal investigation.',
          'We will not speculate on causes while that investigation is under way.',
          'Separately, Internal Audit has raised questions about certain expediting-fee payments. These are being reviewed through normal finance processes.',
        ],
      },
      { t: 'note', text: 'Company Secretary: please confirm framing before the session.' },
    ],
    footer: 'CONFIDENTIAL · BOARD ONLY',
  },

  briefing: {
    id: 'briefing',
    kind: 'brief',
    title: 'Crisis Briefing Note',
    letterhead: true,
    heading: 'Crisis Briefing Note: Company Secretariat',
    classification: 'CONFIDENTIAL · BOARD ONLY',
    alt: 'Crisis briefing note summarising what is known, stakeholders, legal considerations and the self-report decision.',
    keyFacts: [
      '**Known:** the interlock was bypassed, a February near miss was closed locally, and three payments went to one agent.',
      '**Not yet known:** who authorised the bypass to continue, or where the payments ended up.',
      '**Decision required:** whether, when and how DIN self-reports the safety failure and the payments.',
    ],
    blocks: [
      { t: 'meta', rows: [['Date', '22 June 2026']] },
      {
        t: 'p',
        text: '**Incident overview.** A contract worker died on 1 June 2026 at the DIN Ogun State Production Facility, on a production line operating with a safety interlock under temporary bypass. Separately, Internal Audit has identified three expediting-fee payments to one logistics agent over approximately fourteen months.',
      },
      {
        t: 'list',
        ordered: true,
        items: [
          '**What we know.** The interlock was bypassed at the time of the incident. A high-potential near miss on the same line on 4 February 2026 was closed locally without a record of technical restoration. Three payments to Crestfield Logistics Services Ltd. were charged to the “Expediting Fee” budget line. A Regional Director email of 15 May 2026 asks teams to “understand local realities” and “keep documentation light.”',
          '**What we do not yet know.** Who authorised the bypass to continue; the ultimate recipients of the payments; whether Group headquarters was informed informally.',
          '**Stakeholder landscape.** FISCA is aware of the fatality but has not opened a formal inquiry. Employee representatives are raising accountability concerns. The Ogun Business Review is preparing a follow-up. The family of the deceased has requested a meeting.',
          '**Legal and regulatory considerations.** Voluntary disclosure to FISCA remains available and has not been made. Facilitation-type payments may create anti-bribery exposure for DIN and its UK parent. External counsel review is recommended.',
          '**Media and reputational risk.** Public reporting currently concerns the fatality only; the payments have not been publicly linked to it.',
          '==**Decision required.** Whether, when and how DIN self-reports the safety failure and the payments.==',
        ],
      },
    ],
    footer: 'CONFIDENTIAL · BOARD ONLY',
  },
} satisfies Record<string, DocDef>;

export type DocumentKey = keyof typeof DOCUMENTS;
