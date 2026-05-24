import FootPitch from '@/components/foot-pitch';
import Loader from '@/components/loader';
import { Fixture, FormationType, MatchOverviewType } from '@/types/match';
import axios from 'axios';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import Ad from '../ad';

type OverviewProp = {
    slug: string;
    fixture: Fixture;
};

export default function Overview({ slug, fixture }: OverviewProp) {
    const [formation, setFormation] = useState<FormationType[]>([]);
    const [overview, setOverview] = useState<MatchOverviewType>();
    const [loading, setLoading] = useState<boolean>();

    // const generateFormation = (formation: string, mirror: boolean = false): FormationType[] => {
    //     const rows = formation.split('-').map(Number);
    //     rows.unshift(1);

    //     const pitchHeight = 50;
    //     const colSpacing = pitchHeight / (rows.length + 1);
    //     let id = 1;
    //     let players: FormationType[] = [];

    //     rows.forEach((count, index) => {
    //         let x = (index + 1) * colSpacing;
    //         let spacing = 100 / (count + 1);

    //         if (mirror) {
    //             x = 100 - x;
    //         }

    //         for (let i = 1; i <= count; i++) {
    //             players.push({
    //                 id: mirror ? `away-${i}-${index}` : `home-${i}-${index}`,
    //                 isGoalKeeper: index == 0 ? true : false,
    //                 pos: id++,
    //                 x: x,
    //                 y: i * spacing,
    //                 team: mirror ? 'away' : 'home',
    //                 player: mirror ? overview?.awayTeam.lineup.players[i]! : overview?.homeTeam.lineup.players[i]!,
    //             });
    //         }
    //     });

    //     return players;
    // };

    useEffect(() => {
        getOverview();
    }, []);

    const getOverview = async () => {
        try {
            setLoading(true);
            const res = await axios.get<MatchOverviewType>(route('soccer.match.overview', { slug: slug }));

            setOverview(res.data);

            const homePlayers = res.data.hasFormation
                ? res.data.homeTeam.lineup.positions
                : res.data.predictions
                  ? res.data.predictions.homeTeam.lineup.positions
                  : [];
            const awayPlayers = res.data.hasFormation
                ? res.data.awayTeam.lineup.positions
                : res.data.predictions
                  ? res.data.predictions.awayTeam.lineup.positions
                  : [];

            console.log(res.data);

            setFormation([...homePlayers, ...awayPlayers]);

            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Ad />
            <div className="mt-5 overflow-hidden rounded-md bg-white shadow-sm">
                {overview && Object.entries(overview).length && overview.hasFormation && !loading ? (
                    <FootPitch formation={formation} awayTeam={overview.awayTeam} homeTeam={overview.homeTeam} fixture={fixture} />
                ) : overview &&
                  Object.entries(overview).length &&
                  overview.predictions &&
                  Object.entries(overview.predictions).length &&
                  overview.predictions.hasPrediction &&
                  !loading ? (
                    <FootPitch
                        formation={formation}
                        awayTeam={overview.predictions.awayTeam}
                        homeTeam={overview.predictions.homeTeam}
                        fixture={fixture}
                        isPrediction={true}
                    />
                ) : loading ? (
                    <Loader />
                ) : (
                    <div className="mt-5 p-5">
                        <p className="font-bold">{t('No information to show. Please try again.')}</p>
                    </div>
                )}
            </div>
        </>
    );
}
