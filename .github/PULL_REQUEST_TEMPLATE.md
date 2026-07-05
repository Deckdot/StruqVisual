# Pull Request

## Wat & waarom

<!-- 2-5 zinnen. Welke slice/milestone (NORTHSTAR.md)? Wat verandert er voor de gebruiker of het systeem? -->

## Verificatie

- Tier gedraaid: <!-- T0 / T1 / T2 / T3 / T4 -->
- Resultaat: <!-- groen / output plakken bij twijfel -->
- Overgeslagen checks (expliciet benoemen + waarom):

## Doc-drift checklist

- [ ] `PROJECT_STATE.md` bijgewerkt (altijd bij substantieel werk)
- [ ] `NORTHSTAR.md` checkbox afgevinkt (indien milestone-item af)
- [ ] `FEATURES.md` bijgewerkt (indien feature toegevoegd/gewijzigd)
- [ ] `INDEX.md` bijgewerkt (indien repo-structuur gewijzigd)
- [ ] `DESIGN.md` bijgewerkt (indien tokens/motion gewijzigd)
- [ ] Skills alleen in `.skillshare/skills/` bewerkt + `skillshare sync` gedraaid (indien skill gewijzigd)
- [ ] n.v.t. — geen van bovenstaande geraakt (motiveer kort)

## Kwaliteitsgates

- [ ] `psychology`-pass gedaan (indien interactie/flow gewijzigd)
- [ ] `brandvoice`-pass gedaan (indien user-zichtbare tekst gewijzigd)
- [ ] Schema-wijziging: gegenereerd `drizzle/*.sql` bestand zit in deze PR (indien `schema.ts` geraakt)
- [ ] Mobile én desktop expliciet bekeken (indien UI gewijzigd)

## Review

- [ ] Cold code review gedaan (reviewer zonder opgebouwde context)
- [ ] Menselijke verificatie vóór merge
